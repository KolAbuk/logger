"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const logger = new index_1.Logger({
            filePath: "./data/logs/index.txt",
            errorFilePath: "./data/logs/err.txt",
            debugMode: true,
            debugWriteMode: "file",
            useMilliseconds: false,
            maxConsoleTextLen: 20,
        });
        logger.log("test data", {
            background: "bgBlue",
        });
        logger.success("success");
        logger.warn(null);
        logger.error({ error: true, message: { json: "parsed" } });
        logger.debug("Some debug data");
        logger.close();
    }
    catch (e) {
        console.error(e.message);
    }
}))();
