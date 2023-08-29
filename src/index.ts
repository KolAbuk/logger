import { writeFileSync, openSync, closeSync, existsSync, mkdirSync } from "fs";
import { dirname } from "path";
import clc from "cli-color";

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
};
type status = "" | "success|" | "warn   |" | "error  |";

export class Logger {
  private fileDescriptor: number;
  private errorFileDescriptor: number;

  constructor({
    filePath,
    errorFilePath,
  }: {
    filePath: string;
    errorFilePath?: string;
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
  }

  close = (): void => {
    try {
      closeSync(this.fileDescriptor);
      closeSync(this.errorFileDescriptor);
    } catch (e: any) {
      if (e.message != "EBADF: bad file descriptor, close") throw e;
    }
  };

  private zerofill = (val: number): string => {
    try {
      return val < 10 ? `0${val}` : String(val);
    } catch (e) {
      throw e;
    }
  };
  private getTime = (): string => {
    try {
      const date = new Date();
      const d: string = `${date.getFullYear()}.${this.zerofill(
        date.getMonth()
      )}.${this.zerofill(date.getDate())} ${this.zerofill(
        date.getHours()
      )}:${this.zerofill(date.getMinutes())}:${this.zerofill(
        date.getSeconds()
      )}`;
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
      if (typeof data == "object") {
        data = JSON.stringify(data);
      }
      let color: clc.Color | clc.Format = clc;
      color = settings?.color ? color[settings?.color] : color;
      color = settings?.background ? color[settings?.background] : color;
      const consoleData = color(`${this.getTime()}|${statusTitle}${data}`);
      settings?.errorDescriptor
        ? console.error(consoleData)
        : console.log(consoleData);
      const descriptor = settings?.errorDescriptor
        ? this.errorFileDescriptor
        : this.fileDescriptor;
      writeFileSync(
        descriptor,
        `${this.getTime()}|${statusTitle}${data}\n`,
        "utf8"
      );
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
}
