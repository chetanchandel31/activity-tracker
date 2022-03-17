import { Moment } from "moment";
import { getDateStringFromMoment } from "./getDateStringFromMoment";

/**
 * get list of dates between any 2 dates
 *
 * @param startDate - start date
 * @param endDate - end date
 * @returns list of dates between 2 dates
 *
 */
export const getDaysBetween2Dates = (startDate: Moment, endDate: Moment) => {
  const now = startDate.clone();
  const dates = [];

  while (now.isSameOrBefore(endDate)) {
    dates.push(getDateStringFromMoment(now));
    now.add(1, "days");
  }
  return dates;
};
