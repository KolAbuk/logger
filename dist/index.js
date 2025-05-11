"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
class Logger {
    constructor({ dirPath, fileName, errorFileName, debugWriteMode, useMilliseconds, maxConsoleTextLen, showPID, jsonFormat, coloredFileOutput, }) {
        this.close = () => {
            try {
                (0, fs_1.closeSync)(this.fileDescriptor);
                (0, fs_1.closeSync)(this.errorFileDescriptor);
            }
            catch (e) {
                if (e.message != "EBADF: bad file descriptor, close")
                    throw e;
            }
        };
        this.zerofill = (val, digits = 2) => {
            try {
                let res = String(val);
                for (let i = 1; i < digits; i++) {
                    res = Number(res) < 10 ** i ? `0${res}` : res;
                }
                return res;
            }
            catch (e) {
                throw e;
            }
        };
        this.getTime = () => {
            try {
                const date = new Date();
                const d = `${date.getFullYear()}.${this.zerofill(date.getMonth() + 1)}.${this.zerofill(date.getDate())} ${this.zerofill(date.getHours())}:${this.zerofill(date.getMinutes())}:${this.zerofill(date.getSeconds())}${this.useMilliseconds
                    ? `.${this.zerofill(date.getMilliseconds(), 3)}`
                    : ""}`;
                return d;
            }
            catch (e) {
                throw e;
            }
        };
        this.logger = (data, statusTitle, settings) => {
            try {
                const writeMode = (settings === null || settings === void 0 ? void 0 : settings.writeMode) || "console+file";
                if (typeof data == "object") {
                    data = JSON.stringify(data, null, this.jsonFormat);
                }
                const styles = [];
                if (settings === null || settings === void 0 ? void 0 : settings.color) {
                    styles.push(settings.color);
                }
                if (settings === null || settings === void 0 ? void 0 : settings.background) {
                    styles.push(settings.background);
                }
                if (settings === null || settings === void 0 ? void 0 : settings.modifiers) {
                    styles.push(...settings.modifiers);
                }
                const coloredText = (0, util_1.styleText)(styles, `${this.getTime()}|${this.showPID ? process.pid + "|" : ""}${statusTitle}${this.maxConsoleTextLen ? data.slice(0, this.maxConsoleTextLen) : data}`);
                if (writeMode === "console" || writeMode === "console+file") {
                    (settings === null || settings === void 0 ? void 0 : settings.errorDescriptor)
                        ? console.error(coloredText)
                        : console.log(coloredText);
                }
                if (writeMode === "file" || writeMode === "console+file") {
                    const descriptor = (settings === null || settings === void 0 ? void 0 : settings.errorDescriptor)
                        ? this.errorFileDescriptor
                        : this.fileDescriptor;
                    (0, fs_1.writeFileSync)(descriptor, `${this.coloredFileOutput
                        ? coloredText
                        : (0, util_1.stripVTControlCharacters)(coloredText)}\n`, "utf8");
                }
            }
            catch (e) {
                throw e;
            }
        };
        this.log = (data, settings) => this.logger(data, "", settings);
        this.success = (data) => this.logger(data, "success|", { color: "greenBright" });
        this.warn = (data) => this.logger(data, "warn   |", { color: "yellow" });
        this.info = (data) => this.logger(data, "info   |", { color: "blueBright" });
        this.error = (data) => this.logger(data, "error  |", {
            color: "redBright",
            errorDescriptor: true,
        });
        this.debug = (data) => this.debugWriteMode != "none"
            ? this.logger(data, "debug  |", {
                color: "yellow",
                writeMode: this.debugWriteMode,
            })
            : undefined;
        if (!(0, fs_1.existsSync)(dirPath)) {
            (0, fs_1.mkdirSync)(dirPath, { recursive: true });
        }
        if (!fileName) {
            fileName = "log.txt";
        }
        this.fileDescriptor = (0, fs_1.openSync)(path_1.default.join(dirPath, fileName), "a");
        this.errorFileDescriptor = errorFileName
            ? (0, fs_1.openSync)(path_1.default.join(dirPath, errorFileName), "a")
            : this.fileDescriptor;
        this.debugWriteMode = debugWriteMode || "none";
        this.useMilliseconds = useMilliseconds || false;
        this.maxConsoleTextLen = maxConsoleTextLen;
        this.showPID = showPID || false;
        this.jsonFormat = jsonFormat;
        this.coloredFileOutput =
            typeof coloredFileOutput == "undefined" ? true : coloredFileOutput;
    }
}
exports.Logger = Logger;
