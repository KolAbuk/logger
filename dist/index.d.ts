export type writeMode = "none" | "console" | "file" | "console+file";
export type ForegroundColors = "black" | "blackBright" | "blue" | "blueBright" | "cyan" | "cyanBright" | "gray" | "green" | "greenBright" | "grey" | "magenta" | "magentaBright" | "red" | "redBright" | "white" | "whiteBright" | "yellow" | "yellowBright";
export type BackgroundColors = "bgBlack" | "bgBlackBright" | "bgBlue" | "bgBlueBright" | "bgCyan" | "bgCyanBright" | "bgGray" | "bgGreen" | "bgGreenBright" | "bgGrey" | "bgMagenta" | "bgMagentaBright" | "bgRed" | "bgRedBright" | "bgWhite" | "bgWhiteBright" | "bgYellow" | "bgYellowBright";
export type Modifiers = "blink" | "bold" | "dim" | "doubleunderline" | "framed" | "hidden" | "inverse" | "italic" | "overlined" | "reset" | "strikethrough" | "underline";
export type settings = {
    color?: ForegroundColors;
    background?: BackgroundColors;
    modifiers?: Modifiers[];
    errorDescriptor?: boolean;
    writeMode?: writeMode;
};
export type loggerArgs = {
    dirPath: string;
    fileName?: string;
    errorFileName?: string;
    debugWriteMode?: writeMode;
    useMilliseconds?: boolean;
    maxConsoleTextLen?: number;
    showPID?: boolean;
    jsonFormat?: string | number;
    coloredFileOutput?: boolean;
};
export declare class Logger {
    private fileDescriptor;
    private errorFileDescriptor;
    private debugWriteMode;
    private useMilliseconds;
    private maxConsoleTextLen?;
    private showPID;
    private jsonFormat?;
    private coloredFileOutput;
    constructor({ dirPath, fileName, errorFileName, debugWriteMode, useMilliseconds, maxConsoleTextLen, showPID, jsonFormat, coloredFileOutput, }: loggerArgs);
    close: () => void;
    private zerofill;
    private getTime;
    private logger;
    log: (data: any, settings?: settings) => void;
    success: (data: any) => void;
    warn: (data: any) => void;
    info: (data: any) => void;
    error: (data: any) => void;
    debug: (data: any) => void;
}
