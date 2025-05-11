import { writeFileSync, openSync, closeSync, existsSync, mkdirSync } from "fs";
import path from "path";
import { stripVTControlCharacters, styleText } from "node:util";

export type writeMode = "none" | "console" | "file" | "console+file";
export type ForegroundColors =
  | "black"
  | "blackBright"
  | "blue"
  | "blueBright"
  | "cyan"
  | "cyanBright"
  | "gray"
  | "green"
  | "greenBright"
  | "grey"
  | "magenta"
  | "magentaBright"
  | "red"
  | "redBright"
  | "white"
  | "whiteBright"
  | "yellow"
  | "yellowBright";
export type BackgroundColors =
  | "bgBlack"
  | "bgBlackBright"
  | "bgBlue"
  | "bgBlueBright"
  | "bgCyan"
  | "bgCyanBright"
  | "bgGray"
  | "bgGreen"
  | "bgGreenBright"
  | "bgGrey"
  | "bgMagenta"
  | "bgMagentaBright"
  | "bgRed"
  | "bgRedBright"
  | "bgWhite"
  | "bgWhiteBright"
  | "bgYellow"
  | "bgYellowBright";
export type Modifiers =
  | "blink"
  | "bold"
  | "dim"
  | "doubleunderline"
  | "framed"
  | "hidden"
  | "inverse"
  | "italic"
  | "overlined"
  | "reset"
  | "strikethrough"
  | "underline";
export type settings = {
  color?: ForegroundColors;
  background?: BackgroundColors;
  modifiers?: Modifiers[];
  errorDescriptor?: boolean;
  writeMode?: writeMode;
};
type status =
  | ""
  | "success|"
  | "warn   |"
  | "error  |"
  | "debug  |"
  | "info   |";
export type loggerArgs = {
  dirPath: string;
  fileName?: string;
  errorFileName?: string;
  debugWriteMode?: writeMode;
  useMilliseconds?: boolean;
  maxConsoleTextLen?: number;
  showPID?: boolean;
  jsonFormat?: string | number;
  coloredFileOutput?: boolean;
};
export class Logger {
  private fileDescriptor: number;
  private errorFileDescriptor: number;
  private debugWriteMode: writeMode;
  private useMilliseconds: boolean;
  private maxConsoleTextLen?: number;
  private showPID: boolean;
  private jsonFormat?: string | number;
  private coloredFileOutput: boolean;

  constructor({
    dirPath,
    fileName,
    errorFileName,
    debugWriteMode,
    useMilliseconds,
    maxConsoleTextLen,
    showPID,
    jsonFormat,
    coloredFileOutput,
  }: loggerArgs) {
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }
    if (!fileName) {
      fileName = "log.txt";
    }
    this.fileDescriptor = openSync(path.join(dirPath, fileName), "a");
    this.errorFileDescriptor = errorFileName
      ? openSync(path.join(dirPath, errorFileName), "a")
      : this.fileDescriptor;
    this.debugWriteMode = debugWriteMode || "none";
    this.useMilliseconds = useMilliseconds || false;
    this.maxConsoleTextLen = maxConsoleTextLen;
    this.showPID = showPID || false;
    this.jsonFormat = jsonFormat;
    this.coloredFileOutput =
      typeof coloredFileOutput == "undefined" ? true : coloredFileOutput;
  }

  close = (): void => {
    try {
      closeSync(this.fileDescriptor);
      closeSync(this.errorFileDescriptor);
    } catch (e: any) {
      if (e.message != "EBADF: bad file descriptor, close") throw e;
    }
  };

  private zerofill = (val: number, digits: number = 2): string => {
    try {
      let res: string = String(val);
      for (let i = 1; i < digits; i++) {
        res = Number(res) < 10 ** i ? `0${res}` : res;
      }
      return res;
    } catch (e) {
      throw e;
    }
  };
  private getTime = (): string => {
    try {
      const date = new Date();
      const d: string = `${date.getFullYear()}.${this.zerofill(
        date.getMonth() + 1
      )}.${this.zerofill(date.getDate())} ${this.zerofill(
        date.getHours()
      )}:${this.zerofill(date.getMinutes())}:${this.zerofill(
        date.getSeconds()
      )}${
        this.useMilliseconds
          ? `.${this.zerofill(date.getMilliseconds(), 3)}`
          : ""
      }`;
      return d;
    } catch (e) {
      throw e;
    }
  };
  private logger = (
    data: any,
    statusTitle: status,
    settings?: settings
  ): void => {
    try {
      const writeMode: writeMode = settings?.writeMode || "console+file";
      if (typeof data == "object") {
        data = JSON.stringify(data, null, this.jsonFormat);
      }
      const styles: Array<ForegroundColors | BackgroundColors | Modifiers> = [];
      if (settings?.color) {
        styles.push(settings.color);
      }
      if (settings?.background) {
        styles.push(settings.background);
      }
      if (settings?.modifiers) {
        styles.push(...settings.modifiers);
      }
      const coloredText = styleText(
        styles,
        `${this.getTime()}|${
          this.showPID ? process.pid + "|" : ""
        }${statusTitle}${
          this.maxConsoleTextLen ? data.slice(0, this.maxConsoleTextLen) : data
        }`
      );
      if (writeMode === "console" || writeMode === "console+file") {
        settings?.errorDescriptor
          ? console.error(coloredText)
          : console.log(coloredText);
      }
      if (writeMode === "file" || writeMode === "console+file") {
        const descriptor = settings?.errorDescriptor
          ? this.errorFileDescriptor
          : this.fileDescriptor;
        writeFileSync(
          descriptor,
          `${
            this.coloredFileOutput
              ? coloredText
              : stripVTControlCharacters(coloredText)
          }\n`,
          "utf8"
        );
      }
    } catch (e) {
      throw e;
    }
  };

  log = (data: any, settings?: settings): void =>
    this.logger(data, "", settings);
  success = (data: any): void =>
    this.logger(data, "success|", { color: "greenBright" });
  warn = (data: any): void =>
    this.logger(data, "warn   |", { color: "yellow" });
  info = (data: any): void =>
    this.logger(data, "info   |", { color: "blueBright" });
  error = (data: any): void =>
    this.logger(data, "error  |", {
      color: "redBright",
      errorDescriptor: true,
    });
  debug = (data: any): void =>
    this.debugWriteMode != "none"
      ? this.logger(data, "debug  |", {
          color: "yellow",
          writeMode: this.debugWriteMode,
        })
      : undefined;
}
