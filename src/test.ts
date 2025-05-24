import { Logger } from "./index";

(async () => {
  const logger = new Logger({
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
  } catch (e: any) {
    console.error(e.message);
  } finally {
    logger.close();
  }
})();
