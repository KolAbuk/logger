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
    const logger = new index_1.Logger({
        dirPath: "./data/logs/",
        debugWriteMode: "file",
        useMilliseconds: false,
        showPID: true,
        rotateFile: { size: 10, unit: "M" },
    });
    try {
        logger.log("test data", {
            background: "bgBlue",
        });
        logger.success("success");
        logger.warn(null);
        logger.info("info");
        logger.error({ error: true, message: { json: "parsed" } });
        logger.debug("Some debug data");
    }
    catch (e) {
        console.error(e.message);
    }
    finally {
        logger.close();
    }
}))();
