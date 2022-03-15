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
  const isSelectedActivityInvalid =
    activitiesList?.findIndex((el) => el.name === selectedActivity) === -1;

  let isSelectedActivityAlreadyAdded;
  if (!isSelectedActivityInvalid) {
    const activity = findActivityByName(activitiesList, selectedActivity);

    isSelectedActivityAlreadyAdded =
      dateSpecificActivitiesList?.findIndex(
        (el) => el.activityId === activity?.id
      ) !== -1;
  }

  return isSelectedActivityInvalid || isSelectedActivityAlreadyAdded;
};
