import { Activity } from "types";

export const getSearchedActivities = (
  activitieslist: Activity[] | null,
  searchTerm: string
): Activity[] => {
  if (!activitieslist) return [];
  // TODO: add fuzzy search
  return activitieslist.filter((activity) =>
    activity.name.toLowerCase().startsWith(searchTerm.toLowerCase())
  );
};
