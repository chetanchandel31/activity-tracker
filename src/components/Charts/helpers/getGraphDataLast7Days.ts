import firebase from "firebase";
import moment from "moment";
import { Activity, DateSpeceficActivity } from "types";
import {
  findActivityByName,
  getAllFirestoreDocs,
  getDaysBetween2Dates,
} from "utils";

interface Args {
  activitiesList: Activity[] | null;
  selectedActivity: string;
  user: firebase.User;
}

export const getGraphDataLast7Days = async ({
  activitiesList,
  selectedActivity,
  user,
}: Args) => {
  const dates = getDaysBetween2Dates(moment().subtract(6, "days"), moment());
  const mapDatesToActivities: { [date: string]: DateSpeceficActivity[] } = {};

  for (let date of dates) {
    const singleDateActivities: DateSpeceficActivity[] =
      await getAllFirestoreDocs(
        `users/${user.uid}/dates/${date}/date-specific-activities`
      );
    const isSelectedActivity = (activity: DateSpeceficActivity) =>
      activity.id === findActivityByName(activitiesList, selectedActivity)?.id;

    mapDatesToActivities[date] =
      singleDateActivities.filter(isSelectedActivity);
  }

  return mapDatesToActivities;
};
