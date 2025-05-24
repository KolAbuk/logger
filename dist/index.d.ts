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
    fileExt?: string;
    rotateFile?: {
        size: number;
        unit: "B" | "K" | "M" | "G";
    };
    debugWriteMode?: writeMode;
    useMilliseconds?: boolean;
    showPID?: boolean;
    jsonFormat?: string | number;
    coloredFileOutput?: boolean;
};
export declare class Logger {
    private fileStream;
    private debugWriteMode;
    private useMilliseconds;
    private showPID;
    private jsonFormat?;
    private coloredFileOutput;
    private file;
    constructor({ dirPath, fileName, fileExt, debugWriteMode, useMilliseconds, showPID, jsonFormat, coloredFileOutput, rotateFile, }: loggerArgs);
    close: () => void;
    private getFileName;
    private getInitFileId;
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
