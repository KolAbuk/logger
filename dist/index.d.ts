export type settings = {
    color?: "black" | "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white" | "blackBright" | "redBright" | "greenBright" | "yellowBright" | "blueBright" | "magentaBright" | "cyanBright" | "whiteBright";
    background?: "bgBlack" | "bgRed" | "bgGreen" | "bgYellow" | "bgBlue" | "bgMagenta" | "bgCyan" | "bgWhite" | "bgBlackBright" | "bgRedBright" | "bgGreenBright" | "bgYellowBright" | "bgBlueBright" | "bgMagentaBright" | "bgCyanBright" | "bgWhiteBright";
    errorDescriptor?: boolean;
};
export declare class Logger {
    private fileDescriptor;
    private errorFileDescriptor;
    private debugMode;
    constructor({ filePath, errorFilePath, debugMode, }: {
        filePath: string;
        errorFilePath?: string;
        debugMode?: boolean;
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
