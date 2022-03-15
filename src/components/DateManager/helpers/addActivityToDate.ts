import firebase, { firestore } from "firebase-config/firebase";
import moment from "moment";
import { Activity } from "types";
import {
  editFirestoreDoc,
  findActivityByName,
  getDateStringFromMoment,
} from "utils";
import { createNewFirestoreDoc } from "utils/createNewFirestoreDoc";
import { getAppropriateTimestamp } from "./getAppropriateTimestamp";
import { getSortedTimestampArr } from "./getSortedTimestampArr";

interface Args {
  activitiesList: Activity[] | null;
  selectedActivity: string;
  selectedDate: moment.Moment;
  user: firebase.User | null;
}

export const addActivityToDate = ({
  activitiesList,
  selectedActivity,
  selectedDate,
  user,
}: Args) => {
  /* ****** collection refs ****** */
  const selectedDateString = getDateStringFromMoment(selectedDate);
  const activitiesCollectionRef = firestore.collection(
    `users/${user?.uid}/activities`
  );
  const dateSpecificActivitiesCollectionRef = firestore.collection(
    `users/${user?.uid}/dates/${selectedDateString}/date-specific-activities`
  );

  /* ****** look for corresponding activity in `activities` collection ****** */
  const activity = findActivityByName(activitiesList, selectedActivity);

  if (!activity) return;
  const newTimestamp = getAppropriateTimestamp(selectedDate);

  /* ****** update firestore ****** */
  // activities-collection
  editFirestoreDoc({
    collectionRef: activitiesCollectionRef,
    docId: activity.id,
    updatedDoc: {
      performedAt: getSortedTimestampArr([
        ...activity.performedAt,
        newTimestamp,
      ]),
    },
  });

  // date-specific-activities-collection
  createNewFirestoreDoc({
    collectionRef: dateSpecificActivitiesCollectionRef,
    doc: {
      activityId: activity.id,
      performedAt: [newTimestamp],
      activityRef: firestore
        .collection(`users/${user?.uid}/activities/`)
        .doc(activity.id),
    },
    docId: activity.id,
  });
};
