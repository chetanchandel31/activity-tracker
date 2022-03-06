import firebase from "firebase";
import moment from "moment";
import { DateSpeceficActivity } from "types";
import { getAllFirestoreDocs, getDaysBetween2Dates } from "utils";

interface Args {
  n?: 7 | 15 | 30;
  selectedActivityId: string;
  user: firebase.User;
}

export const LAST_7_DAYS = "last 7 days";
export const LAST_15_DAYS = "last 15 days";
export const LAST_30_DAYS = "last 30 days";

export const getGraphDataLastNDays = async ({
  n = 7,
  selectedActivityId,
  user,
}: Args) => {
  const dates = getDaysBetween2Dates(
    moment().subtract(n - 1, "days"),
    moment()
  );

  const xAxisData: string[] = [];
  const yAxisData: number[] = [];

  for (let date of dates) {
    const singleDateActivities: DateSpeceficActivity[] =
      await getAllFirestoreDocs(
        `users/${user.uid}/dates/${date}/date-specific-activities`
      );

    const isSelectedActivity = (activity: DateSpeceficActivity) =>
      activity.id === selectedActivityId;

    const selectedActivityFrequency =
      singleDateActivities.find(isSelectedActivity)?.performedAt.length || 0;

    xAxisData.push(date);
    yAxisData.push(selectedActivityFrequency);
  }

  return { xAxisData, yAxisData };
};
