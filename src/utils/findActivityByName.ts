import { Activity } from "types";

export const findActivityByName = (list: Activity[] | null, name: string) =>
  list?.find((el) => el.name === name);
