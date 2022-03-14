import { Timestamp } from "types";

export const getSortedTimestampArr = (timestampArr: Timestamp[]) =>
  timestampArr.sort((a, b) => a.timestamp - b.timestamp);
