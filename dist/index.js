"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const node_path_1 = __importDefault(require("node:path"));
const node_util_1 = require("node:util");
const node_fs_1 = require("node:fs");
class Logger {
    constructor({ dirPath, fileName, fileExt, debugWriteMode, useMilliseconds, showPID, jsonFormat, coloredFileOutput, rotateFile, }) {
        this.close = () => this.fileStream.close((err) => {
            if (err) {
                throw err;
            }
        });
        this.getFileName = () => node_path_1.default.join(this.file.dir, `${this.file.name}.${this.file.id}.${this.file.ext}`);
        this.getInitFileId = () => {
            try {
                try {
                    (0, node_fs_1.accessSync)(this.file.dir);
                }
                catch (_a) {
                    (0, node_fs_1.mkdirSync)(this.file.dir, { recursive: true });
                }
                if (!this.file.id) {
                    this.file.id =
                        (0, node_fs_1.readdirSync)(this.file.dir)
                            .filter((el) => el.match(`${this.file.name}.*.${this.file.ext}`))
                            .map((el) => Number(el.split(".").at(-2)))
                            .sort((a, b) => b - a)[0] || 0;
                }
                try {
                    const fileName = this.getFileName();
                    (0, node_fs_1.accessSync)(fileName);
                    const st = (0, node_fs_1.statSync)(fileName);
                    this.file.writed = st.size;
                    if (this.file.writed > this.file.maxSize) {
                        this.file.id++;
                        this.file.writed = 0;
                    }
                }
                catch (_b) { }
            }
            catch (e) {
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
                if (this.file.writed > this.file.maxSize) {
                    this.fileStream.end();
                    this.file.id++;
                    this.file.writed = 0;
                    this.fileStream = (0, node_fs_1.createWriteStream)(this.getFileName(), {
                        flags: "a",
                        encoding: "utf8",
                    });
                }
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
                const coloredText = (0, node_util_1.styleText)(styles, `${this.getTime()}|${this.showPID ? process.pid + "|" : ""}${statusTitle}${data}`, { validateStream: false });
                if (writeMode === "console" || writeMode === "console+file") {
                    (settings === null || settings === void 0 ? void 0 : settings.errorDescriptor)
                        ? console.error(coloredText)
                        : console.log(coloredText);
                }
                if (writeMode === "file" || writeMode === "console+file") {
                    const text = `${this.coloredFileOutput
                        ? coloredText
                        : (0, node_util_1.stripVTControlCharacters)(coloredText)}\n`;
                    this.fileStream.write(text);
                    this.file.writed += Buffer.byteLength(text, "utf8");
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
            dir: node_path_1.default.resolve(dirPath),
            name: fileName || "log",
            ext: fileExt || "ansi",
            id: 0,
        };
        this.getInitFileId();
        this.fileStream = (0, node_fs_1.createWriteStream)(this.getFileName(), {
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
}
exports.Logger = Logger;
