import moment from "moment";
import { getDateStringFromMoment } from "utils";
import { History } from "history";

export const visitPreviousDate = (
  selectedDate: moment.Moment,
  history: History
) => {
  const prevDate = selectedDate.subtract(1, "day");
  history.push(`/date-manager/${getDateStringFromMoment(prevDate)}`);
};
