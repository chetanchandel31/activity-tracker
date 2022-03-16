import { History } from "history";

export const doOpenCreateActivityDialogOnFirstRender = (history: History) =>
  history.push("/activity-manager", {
    doOpenCreateActivityDialogOnFirstRender: true,
  });
