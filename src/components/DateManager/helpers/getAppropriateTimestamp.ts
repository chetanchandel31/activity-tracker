import moment from "moment";
import { getDateStringFromMoment } from "utils";
import { v4 as uuidv4 } from "uuid";
import { areTwoDatesSame } from "./areTwoDatesSame";

export const getAppropriateTimestamp = (selectedDate: moment.Moment) => {
  // can't use now() as timestamp if activity is being added to a past date, hence all this

  const selectedDateString = getDateStringFromMoment(selectedDate); //"22/2/2222"

  const isSelectedDateSameAsCurrentDate = areTwoDatesSame(
    selectedDate,
    moment()
  );

  if (isSelectedDateSameAsCurrentDate)
    return { timestamp: moment().unix(), timestampId: `t-${uuidv4()}` };
  else
    return {
      timestamp: moment(selectedDateString).add(6, "hours").unix(),
      timestampId: `t-${uuidv4()}`,
    };
};
