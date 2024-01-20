"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const cli_color_1 = __importDefault(require("cli-color"));
class Logger {
    constructor({ filePath, errorFilePath, debugMode, debugWriteMode, useMilliseconds, }) {
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
        this.zerofill = (val) => {
            try {
                return val < 10 ? `0${val}` : String(val);
            }
            catch (e) {
                throw e;
            }
        };
        this.getTime = () => {
            try {
                const date = new Date();
                const d = `${date.getFullYear()}.${this.zerofill(date.getMonth() + 1)}.${this.zerofill(date.getDate())} ${this.zerofill(date.getHours())}:${this.zerofill(date.getMinutes())}:${this.zerofill(date.getSeconds())}${this.useMilliseconds ? `.${this.zerofill(date.getMilliseconds())}` : ""}`;
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
                    data = JSON.stringify(data);
                }
                let color = cli_color_1.default;
                color = (settings === null || settings === void 0 ? void 0 : settings.color) ? color[settings === null || settings === void 0 ? void 0 : settings.color] : color;
                color = (settings === null || settings === void 0 ? void 0 : settings.background) ? color[settings === null || settings === void 0 ? void 0 : settings.background] : color;
                const consoleData = color(`${this.getTime()}|${statusTitle}${data}`);
                if (writeMode === "console" || writeMode === "console+file") {
                    (settings === null || settings === void 0 ? void 0 : settings.errorDescriptor)
                        ? console.error(consoleData)
                        : console.log(consoleData);
                }
                if (writeMode === "file" || writeMode === "console+file") {
                    const descriptor = (settings === null || settings === void 0 ? void 0 : settings.errorDescriptor)
                        ? this.errorFileDescriptor
                        : this.fileDescriptor;
                    (0, fs_1.writeFileSync)(descriptor, `${this.getTime()}|${statusTitle}${data}\n`, "utf8");
                }
            }
            catch (e) {
                throw e;
            }
        };
        this.log = (data, settings) => {
            try {
                this.logger(data, "", settings);
            }
            catch (e) {
                throw e;
            }
        };
        this.success = (data) => {
            try {
                this.logger(data, "success|", { color: "greenBright" });
            }
            catch (e) {
                throw e;
            }
        };
        this.warn = (data) => {
            try {
                this.logger(data, "warn   |", { color: "yellow" });
            }
            catch (e) {
                throw e;
            }
        };
        this.error = (data) => {
            try {
                this.logger(data, "error  |", {
                    color: "redBright",
                    errorDescriptor: true,
                });
            }
            catch (e) {
                throw e;
            }
        };
        this.debug = (data) => {
            try {
                this.debugMode
                    ? this.logger(data, "debug  |", {
                        color: "yellow",
                        writeMode: this.debugWriteMode,
                    })
                    : null;
            }
            catch (e) {
                throw e;
            }
        };
        if (!(0, fs_1.existsSync)((0, path_1.dirname)(filePath))) {
            (0, fs_1.mkdirSync)((0, path_1.dirname)(filePath), { recursive: true });
        }
        this.fileDescriptor = (0, fs_1.openSync)(filePath, "a");
        if (errorFilePath && !(0, fs_1.existsSync)((0, path_1.dirname)(errorFilePath))) {
            (0, fs_1.mkdirSync)((0, path_1.dirname)(errorFilePath), { recursive: true });
        }
        this.errorFileDescriptor = errorFilePath
            ? (0, fs_1.openSync)(errorFilePath, "a")
            : this.fileDescriptor;
        this.debugMode = debugMode || false;
        this.debugWriteMode = debugWriteMode || "console+file";
        this.useMilliseconds = useMilliseconds || false;
    }
}
exports.Logger = Logger;
