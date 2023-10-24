import express, { Request, Response } from "express";
import { dataUtil } from "./utils/dataUtil";

const app = express()
const logs = dataUtil("./data/sample_log_file.txt");

if (!logs) {
    throw new Error("DATA is not readable. Cannot start server");
}
// 1. given a time window and status code, return count
// 2. given a time window and endpoint, return min, max, avg response time
// 3. given a time window and endpoint, return counts of all status codes

app.get('/', (req: Request, res: Response) => res.send('Hello World from app.ts!'))

app.get("/count", (req: Request, res: Response) => {
    const timeStart = Number.parseInt(req.query.timeStart as string);
    const timeEnd = Number.parseInt(req.query.timeEnd as string);
    const status = Number.parseInt(req.query.status as string);
    var count = 0;
    for (let log of logs) {
        if (log.timeStamp > timeStart && log.timeStamp < timeEnd && log.statusCode == status) {
            count += 1;
        }
    }
    return res.json(JSON.stringify({
        count
    }))
});

app.get("/count-math", (req: Request, res: Response) => {
    const timeStart = Number.parseInt(req.query.timeStart as string);
    const timeEnd = Number.parseInt(req.query.timeEnd as string);
    const endPoint = req.query.endPoint;

    var count = 0;
    var totalTime = 0;
    var min = Number.POSITIVE_INFINITY;
    var max = Number.NEGATIVE_INFINITY;

    for (let log of logs) {
        if (log.timeStamp > timeStart && log.timeStamp < timeEnd && log.endPoint == endPoint) {
            count += 1;
            totalTime += log.rts;
            min = Math.min(min, log.rts);
            max = Math.max(max, log.rts)
        }
    }

    return res.json(JSON.stringify({
        max,
        min,
        avg: totalTime / count
    }))
});
app.get("/count-unique", (req: Request, res: Response) => {
    const timeStart = Number.parseInt(req.query.timeStart as string);
    const timeEnd = Number.parseInt(req.query.timeEnd as string);
    const endPoint = req.query.endPoint;
    var countStatus: {
        [key: number]: number
    } = {};

    for (let log of logs) {
        if (log.timeStamp >= timeStart && log.timeStamp <= timeEnd && log.endPoint == endPoint) {
            if (log.statusCode in countStatus) {
                countStatus[log.statusCode] += 1;
            } else {
                countStatus[log.statusCode] = 1;
            }
        }
    }
    return res.json(JSON.stringify({
        countStatus
    }))
});
export default app;
