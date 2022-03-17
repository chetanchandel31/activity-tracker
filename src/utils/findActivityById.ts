import { Activity } from "types";

export const findActivityById = (list: Activity[] | null, id: string) =>
  list?.find((el) => el.id === id);
