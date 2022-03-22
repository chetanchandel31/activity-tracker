import { Activity } from "types";

export const sortOptions = [
  "newest first",
  "oldest first",
  "name (a - z)",
  "name (z - a)",
  "",
] as const;

export type SortOption = typeof sortOptions[number];

export const getSortedActivities = (
  activitiesList: Activity[] | null,
  sortType?: SortOption | null
): Activity[] => {
  if (!activitiesList) return [];

  if (sortType === "newest first")
    return [...activitiesList.sort((a, b) => b.createdAt - a.createdAt)];
  else if (sortType === "oldest first")
    return [...activitiesList.sort((a, b) => a.createdAt - b.createdAt)];
  else if (sortType === "name (a - z)")
    return [...activitiesList.sort((a, b) => (a.name > b.name ? 1 : -1))];
  else if (sortType === "name (z - a)")
    return [...activitiesList.sort((a, b) => (a.name > b.name ? -1 : 1))];

  return [...activitiesList];
};
