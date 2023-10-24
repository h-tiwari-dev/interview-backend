import { readFileSync } from "fs";
import { LogDataInterface } from "../interfaces/logData";
import { STATUS } from "../constants/status.enum";

export const dataUtil = function (fileName: string): LogDataInterface[] | undefined {
    try {
        const fileData = readFileSync(fileName, "utf8");
        const logData: LogDataInterface[] = fileData.trim().split("\n").map(log => {
            const data = log.split(" ");
            return {
                timeStamp: Number.parseInt(data[0]),
                status: data[1] == "SUCCESS" ? STATUS.SUCCESS : STATUS.ERROR,
                statusCode: Number.parseInt(data[2]),
                endPoint: data[3],
                rts: Number.parseInt(data[4]),
            }
        })
        return logData;
    } catch (error) {
        console.log("ERROR", error);
        return undefined;
    }
}