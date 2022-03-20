import moment from "moment";
import { getDateStringFromMoment } from "utils";
import { Path } from "../constants";
import { History } from "history";

export const navigateTo = (path: Path, history: History) => {
  if (path === "/date-manager")
    history.push(`/date-manager/${getDateStringFromMoment(moment())}`);
  else history.push(`${path}`);
};
