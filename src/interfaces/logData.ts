import { STATUS } from "../constants/status.enum";

export interface LogDataInterface {
    timeStamp: number,
    status: STATUS,
    statusCode: number,
    endPoint: string,
    rts: number
}