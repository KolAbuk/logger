import { Logger } from "./index";

(async () => {
  try {
    const logger = new Logger({
      filePath: "./data/logs/index.txt",
      errorFilePath: "./data/logs/err.txt",
    });
    logger.log("test data", {
      background: "bgBlue",
    });
    logger.success("success");
    logger.warn(null);
    logger.error({ error: true, message: { json: "parsed" } });
    logger.close();
  } catch (e: any) {
    console.error(e.message);
  }
})();
