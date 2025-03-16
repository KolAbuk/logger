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
  dirPath: "./data/logs/main",
  fileName: "index.txt",
  errorFileName: "index.err.txt",
  debugMode: true,
  debugWriteMode: "file", //console only/file only/console+file
  useMilliseconds: false,
  maxConsoleTextLen: 20, //slice console output if define, file output always full
});
logger.log("test data", {
  background: "bgBlue",
});
logger.success("success");
logger.warn(null);
logger.error({ error: true, message: { json: "parsed" } });
logger.debug("Some debug data"); //ignored if debugMode==false
logger.close();
```

Console output
<br>
![Console output](https://github.com/KolAbuk/logger/blob/master/console_output.png)

File output
<br>
![File output](https://github.com/KolAbuk/logger/blob/master/file_output.png)
