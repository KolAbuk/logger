import { writeFileSync, openSync, closeSync, existsSync, mkdirSync } from "fs";
import { dirname } from "path";
import clc from "cli-color";

type writeMode = "console" | "file" | "console+file";
export type settings = {
  color?:
    | "black"
    | "red"
    | "green"
    | "yellow"
    | "blue"
    | "magenta"
    | "cyan"
    | "white"
    | "blackBright"
    | "redBright"
    | "greenBright"
    | "yellowBright"
    | "blueBright"
    | "magentaBright"
    | "cyanBright"
    | "whiteBright";
  background?:
    | "bgBlack"
    | "bgRed"
    | "bgGreen"
    | "bgYellow"
    | "bgBlue"
    | "bgMagenta"
    | "bgCyan"
    | "bgWhite"
    | "bgBlackBright"
    | "bgRedBright"
    | "bgGreenBright"
    | "bgYellowBright"
    | "bgBlueBright"
    | "bgMagentaBright"
    | "bgCyanBright"
    | "bgWhiteBright";
  errorDescriptor?: boolean;
  writeMode?: writeMode;
};
type status = "" | "success|" | "warn   |" | "error  |" | "debug  |";

export class Logger {
  private fileDescriptor: number;
  private errorFileDescriptor: number;
  private debugMode: boolean;
  private debugWriteMode: writeMode;
  private useMilliseconds: boolean;

  constructor({
    filePath,
    errorFilePath,
    debugMode,
    debugWriteMode,
    useMilliseconds,
  }: {
    filePath: string;
    errorFilePath?: string;
    debugMode?: boolean;
    debugWriteMode?: writeMode;
    useMilliseconds?: boolean;
  }) {
    if (!existsSync(dirname(filePath))) {
      mkdirSync(dirname(filePath), { recursive: true });
    }
    this.fileDescriptor = openSync(filePath, "a");
    if (errorFilePath && !existsSync(dirname(errorFilePath))) {
      mkdirSync(dirname(errorFilePath), { recursive: true });
    }
    this.errorFileDescriptor = errorFilePath
      ? openSync(errorFilePath, "a")
      : this.fileDescriptor;
    this.debugMode = debugMode || false;
    this.debugWriteMode = debugWriteMode || "console+file";
    this.useMilliseconds = useMilliseconds || false;
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
        data = JSON.stringify(data);
      }
      let color: clc.Color | clc.Format = clc;
      color = settings?.color ? color[settings?.color] : color;
      color = settings?.background ? color[settings?.background] : color;
      const consoleData = color(`${this.getTime()}|${statusTitle}${data}`);
      if (writeMode === "console" || writeMode === "console+file") {
        settings?.errorDescriptor
          ? console.error(consoleData)
          : console.log(consoleData);
      }
      if (writeMode === "file" || writeMode === "console+file") {
        const descriptor = settings?.errorDescriptor
          ? this.errorFileDescriptor
          : this.fileDescriptor;
        writeFileSync(
          descriptor,
          `${this.getTime()}|${statusTitle}${data}\n`,
          "utf8"
        );
      }
    } catch (e) {
      throw e;
    }
  };

  log = (data: any, settings?: settings): void => {
    try {
      this.logger(data, "", settings);
    } catch (e) {
      throw e;
    }
  };
  success = (data: any): void => {
    try {
      this.logger(data, "success|", { color: "greenBright" });
    } catch (e) {
      throw e;
    }
  };
  warn = (data: any): void => {
    try {
      this.logger(data, "warn   |", { color: "yellow" });
    } catch (e) {
      throw e;
    }
  };
  error = (data: any): void => {
    try {
      this.logger(data, "error  |", {
        color: "redBright",
        errorDescriptor: true,
      });
    } catch (e) {
      throw e;
    }
  };
  debug = (data: any): void => {
    try {
      this.debugMode
        ? this.logger(data, "debug  |", {
            color: "yellow",
            writeMode: this.debugWriteMode,
          })
        : null;
    } catch (e) {
      throw e;
    }
  };
}
