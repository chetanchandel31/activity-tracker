import moment from "moment";
import { getDateStringFromMoment } from "utils";
import { History } from "history";

export const visitNextDate = (
  selectedDate: moment.Moment,
  history: History
) => {
  const nextDate = selectedDate.add(1, "day");
  history.push(`/date-manager/${getDateStringFromMoment(nextDate)}`);
};
