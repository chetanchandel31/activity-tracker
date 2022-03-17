import { History } from "history";

export const openCreateActivityDialogOnFirstRender = (
  history: History,
  initialActivityName?: string
) =>
  history.push("/activity-manager", {
    doOpenCreateActivityDialogOnFirstRender: true,
    initialActivityName,
  });
