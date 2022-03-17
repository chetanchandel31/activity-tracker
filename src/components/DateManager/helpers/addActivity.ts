import { Activity } from "types";
import firebase from "firebase-config/firebase";
import { addActivityToDate } from "./addActivityToDate";

interface Args {
  activitiesList: Activity[] | null;
  openRedirectDialog: () => void;
  selectedActivity: string;
  selectedDate: moment.Moment;
  user: firebase.User | null;
}

export const addActivity = ({
  activitiesList,
  openRedirectDialog,
  selectedActivity,
  selectedDate,
  user,
}: Args) => {
  const isSelectedActivityInvalid =
    activitiesList?.findIndex((el) => el.name === selectedActivity) === -1;

  if (isSelectedActivityInvalid) {
    openRedirectDialog();
  } else {
    addActivityToDate({
      activitiesList,
      selectedActivity,
      selectedDate,
      user,
    });
  }
};
