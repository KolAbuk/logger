declare type writeMode = "console" | "file" | "console+file";
export declare type settings = {
    color?: "black" | "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white" | "blackBright" | "redBright" | "greenBright" | "yellowBright" | "blueBright" | "magentaBright" | "cyanBright" | "whiteBright";
    background?: "bgBlack" | "bgRed" | "bgGreen" | "bgYellow" | "bgBlue" | "bgMagenta" | "bgCyan" | "bgWhite" | "bgBlackBright" | "bgRedBright" | "bgGreenBright" | "bgYellowBright" | "bgBlueBright" | "bgMagentaBright" | "bgCyanBright" | "bgWhiteBright";
    errorDescriptor?: boolean;
    writeMode?: writeMode;
};
export declare class Logger {
    private fileDescriptor;
    private errorFileDescriptor;
    private debugMode;
    private debugWriteMode;
    private useMilliseconds;
    constructor({ filePath, errorFilePath, debugMode, debugWriteMode, useMilliseconds, }: {
        filePath: string;
        errorFilePath?: string;
        debugMode?: boolean;
        debugWriteMode?: writeMode;
        useMilliseconds?: boolean;
    });
    close: () => void;
    private zerofill;
    private getTime;
    private logger;
    log: (data: any, settings?: settings | undefined) => void;
    success: (data: any) => void;
    warn: (data: any) => void;
    error: (data: any) => void;
    debug: (data: any) => void;
}
export {};
