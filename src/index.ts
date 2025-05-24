import { createWriteStream, WriteStream } from "fs";
import path from "path";
import { stripVTControlCharacters, styleText } from "node:util";
import {
  accessSync,
  mkdirSync,
  readdirSync,
  statSync,
  constants,
} from "node:fs";

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
  fileExt?: string;
  rotateFile?: { size: number; unit: "B" | "K" | "M" | "G" };
  debugWriteMode?: writeMode;
  useMilliseconds?: boolean;
  showPID?: boolean;
  jsonFormat?: string | number;
  coloredFileOutput?: boolean;
};
export class Logger {
  private fileStream: WriteStream;
  private debugWriteMode: writeMode;
  private useMilliseconds: boolean;
  private showPID: boolean;
  private jsonFormat?: string | number;
  private coloredFileOutput: boolean;
  private file: {
    maxSize: number;
    writed: number;
    dir: string;
    name: string;
    id: number;
    ext: string;
  };

  constructor({
    dirPath,
    fileName,
    fileExt,
    debugWriteMode,
    useMilliseconds,
    showPID,
    jsonFormat,
    coloredFileOutput,
    rotateFile,
  }: loggerArgs) {
    const rotateFileUnit2Bytes = {
      B: 1,
      K: 1024,
      M: 1024 * 1024,
      G: 1024 * 1024 * 1024,
    };
    if (!rotateFile) {
      rotateFile = { size: 10, unit: "M" };
    }
    this.file = {
      writed: 0,
      maxSize: rotateFile.size * rotateFileUnit2Bytes[rotateFile.unit],
      dir: path.resolve(dirPath),
      name: fileName || "log",
      ext: fileExt || "ansi",
      id: 0,
    };
    this.getInitFileId();
    this.fileStream = createWriteStream(this.getFileName(), {
      flags: "a",
      encoding: "utf8",
    });
    this.debugWriteMode = debugWriteMode || "console+file";
    this.useMilliseconds =
      typeof useMilliseconds == "undefined" ? true : useMilliseconds;
    this.showPID = showPID || false;
    this.jsonFormat = jsonFormat;
    this.coloredFileOutput =
      typeof coloredFileOutput == "undefined" ? true : coloredFileOutput;
  }

  close = (): void =>
    this.fileStream.close((err) => {
      if (err) {
        throw err;
      }
    });
  private getFileName = (): string =>
    path.join(
      this.file.dir,
      `${this.file.name}.${this.file.id}.${this.file.ext}`
    );
  private getInitFileId = (): void => {
    try {
      try {
        accessSync(this.file.dir);
      } catch {
        mkdirSync(this.file.dir, { recursive: true });
      }
      if (!this.file.id) {
        this.file.id =
          readdirSync(this.file.dir)
            .filter((el) => el.match(`${this.file.name}.*.${this.file.ext}`))
            .map((el) => Number(el.split(".").at(-2)))
            .sort((a, b) => b - a)[0] || 0;
      }
      try {
        const fileName = this.getFileName();
        accessSync(fileName, constants.R_OK);
        const st = statSync(fileName);
        this.file.writed = st.size;
        if (this.file.writed > this.file.maxSize) {
          this.file.id++;
          this.file.writed = 0;
        }
      } catch {}
    } catch (e) {
      throw e;
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
      if (this.file.writed > this.file.maxSize) {
        this.fileStream.end();
        this.file.id++;
        this.file.writed = 0;
        this.fileStream = createWriteStream(this.getFileName(), {
          flags: "a",
          encoding: "utf8",
        });
      }
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
        }${statusTitle}${data}`,
        { validateStream: false }
      );
      if (writeMode === "console" || writeMode === "console+file") {
        settings?.errorDescriptor
          ? console.error(coloredText)
          : console.log(coloredText);
      }
      if (writeMode === "file" || writeMode === "console+file") {
        const text = `${
          this.coloredFileOutput
            ? coloredText
            : stripVTControlCharacters(coloredText)
        }\n`;
        this.fileStream.write(text);
        this.file.writed += Buffer.byteLength(text, "utf8");
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
