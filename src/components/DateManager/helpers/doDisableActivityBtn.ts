import { Activity, DateSpeceficActivity } from "types";
import { findActivityByName } from "utils";

interface Args {
  dateSpecificActivitiesList: DateSpeceficActivity[] | null;
  selectedActivity: string;
  activitiesList: Activity[] | null;
}

export const doDisableActivityBtn = ({
  activitiesList,
  dateSpecificActivitiesList,
  selectedActivity,
}: Args) => {
  const activity = findActivityByName(activitiesList, selectedActivity);

  const isSelectedActivityAlreadyAdded =
    dateSpecificActivitiesList?.findIndex(
      (el) => el.activityId === activity?.id
    ) !== -1;

  return !selectedActivity || isSelectedActivityAlreadyAdded;
};
