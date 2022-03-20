import { Activity, DateSpeceficActivity } from "types";
import { findActivityByName } from "utils";

interface Args {
  dateSpecificActivitiesList: DateSpeceficActivity[] | null;
  selectedActivity: string;
  activitiesList: Activity[] | null;
}

export const isSelectedActivityAlreadyAdded = ({
  activitiesList,
  dateSpecificActivitiesList,
  selectedActivity,
}: Args) => {
  const activity = findActivityByName(activitiesList, selectedActivity);

  return (
    dateSpecificActivitiesList?.findIndex(
      (el) => el.activityId === activity?.id
    ) !== -1
  );
};
