import { Activity } from "types";
import Fuse from "fuse.js";

export const getSearchedActivities = (
  activitiesList: Activity[] | null,
  searchTerm: string
): Activity[] => {
  if (!activitiesList) return [];
  if (!searchTerm) return [...activitiesList];

  const fuse = new Fuse(activitiesList, {
    keys: ["name"],
    threshold: 0.4,
  });

  return fuse.search(searchTerm).map((el) => el.item);
};
