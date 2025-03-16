type writeMode = "console" | "file" | "console+file";
export type settings = {
    color?: "black" | "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white" | "blackBright" | "redBright" | "greenBright" | "yellowBright" | "blueBright" | "magentaBright" | "cyanBright" | "whiteBright";
    background?: "bgBlack" | "bgRed" | "bgGreen" | "bgYellow" | "bgBlue" | "bgMagenta" | "bgCyan" | "bgWhite" | "bgBlackBright" | "bgRedBright" | "bgGreenBright" | "bgYellowBright" | "bgBlueBright" | "bgMagentaBright" | "bgCyanBright" | "bgWhiteBright";
    errorDescriptor?: boolean;
    writeMode?: writeMode;
};
export type loggerArgs = {
    dirPath: string;
    fileName?: string;
    errorFileName?: string;
    debugMode?: boolean;
    debugWriteMode?: writeMode;
    useMilliseconds?: boolean;
    maxConsoleTextLen?: number;
    showPID?: boolean;
};
export declare class Logger {
    private fileDescriptor;
    private errorFileDescriptor;
    private debugMode;
    private debugWriteMode;
    private useMilliseconds;
    private maxConsoleTextLen?;
    private showPID;
    constructor({ dirPath, fileName, errorFileName, debugMode, debugWriteMode, useMilliseconds, maxConsoleTextLen, showPID, }: loggerArgs);
    close: () => void;
    private zerofill;
    private getTime;
    private logger;
    log: (data: any, settings?: settings | undefined) => void;
    success: (data: any) => void;
    warn: (data: any) => void;
    info: (data: any) => void;
    error: (data: any) => void;
    debug: (data: any) => void;
}
export {};
