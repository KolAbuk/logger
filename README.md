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

Console output<br>
<span style="color:white;background-color:blue">2023.07.29 14:29:25|test data</span><br>
<span style="color:green;">2023.07.29 14:29:25|success|success</span><br>
<span style="color:yellow;">2023.07.29 14:29:25|warn |null</span><br>
<span style="color:red;">2023.07.29 14:29:25|error |{"error":true,"message":{"json":"parsed"}}</span><br>
