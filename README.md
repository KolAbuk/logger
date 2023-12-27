# @kolabuk/logger

Node.js logger with ts declaration

## Installation

```bash
npm i @kolabuk/logger
```

## Importing

```javascript
import { Logger } from "@kolabuk/logger";
```

## Usage

```javascript
const logger = new Logger({
  filePath: "./data/logs/index.txt",
  errorFilePath: "./data/logs/err.txt",
  debugMode: true,
});
logger.log("test data", {
  background: "bgBlue",
});
logger.success("success");
logger.warn(null);
logger.error({ error: true, message: { json: "parsed" } });
logger.debug("Some debug data"); //prints only if debugMode=true
logger.close();
```

Console output
<br>
![Console output](https://github.com/KolAbuk/logger/blob/master/image.png)
