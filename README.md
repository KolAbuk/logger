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
});
logger.log("test data", {
  background: "bgBlue",
});
logger.success("success");
logger.warn(null);
logger.error({ error: true, message: { json: "parsed" } });
logger.close();
```

Console output
![Console output](output.png)