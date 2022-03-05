import firebase from "firebase";
import moment from "moment";
import { DateSpeceficActivity } from "types";
import { getAllFirestoreDocs, getDaysBetween2Dates } from "utils";

interface Args {
  selectedActivityId: string;
  user: firebase.User;
}

export const getGraphDataLast7Days = async ({
  selectedActivityId,
  user,
}: Args) => {
  const dates = getDaysBetween2Dates(moment().subtract(6, "days"), moment());

  const xAxisData: string[] = [];
  const yAxisData: number[] = [];

  for (let date of dates) {
    const singleDateActivities: DateSpeceficActivity[] =
      await getAllFirestoreDocs(
        `users/${user.uid}/dates/${date}/date-specific-activities`
      );

    const isSelectedActivity = (activity: DateSpeceficActivity) =>
      activity.id === selectedActivityId;

    xAxisData.push(date);
    yAxisData.push(singleDateActivities.filter(isSelectedActivity).length);
  }

  return { xAxisData, yAxisData };
};
