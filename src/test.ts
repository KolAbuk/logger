import { Logger } from "./index";

(async () => {
  try {
    const logger = new Logger({
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
    logger.info("info");
    logger.error({ error: true, message: { json: "parsed" } });
    logger.debug("Some debug data");
    logger.close();
  } catch (e: any) {
    console.error(e.message);
  }
})();
