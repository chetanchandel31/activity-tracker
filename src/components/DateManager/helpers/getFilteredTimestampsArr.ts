import { Timestamp } from "types";

export const getFilteredTimestampsArr = (
  timestampsArr: Timestamp[],
  timestampsToBeFilteredArr: Timestamp[]
) =>
  timestampsArr.filter(
    (el) =>
      !timestampsToBeFilteredArr.find((x) => x.timestampId === el.timestampId)
  );
