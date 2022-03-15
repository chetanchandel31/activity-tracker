import firebase, { firestore } from "firebase-config/firebase";
import moment from "moment";
import { Activity, Timestamp } from "types";
import {
  editFirestoreDoc,
  findActivityById,
  getDateStringFromMoment,
} from "utils";
import { getAppropriateTimestamp } from "./getAppropriateTimestamp";
import { getFilteredTimestampsArr } from "./getFilteredTimestampsArr";
import { getSortedTimestampArr } from "./getSortedTimestampArr";

interface Args {
  activityId: string;
  activitiesList: Activity[] | null;
  dateSpecificActivitiesPerformedAtArr: Timestamp[];
  deleteActivityFromDate: (
    activityId: string,
    dateSpecificActivitiesPerformedAtArr: Timestamp[]
  ) => void; // TODO: REMOVE IT AND IMPORT INSTEAD. IF IT MANAGES TO GET EXTRACTED OUT
  selectedDate: moment.Moment;
  updateType: "increase" | "decrease";
  user: firebase.User | null;
}

export const updateFrequency = ({
  activitiesList,
  activityId,
  dateSpecificActivitiesPerformedAtArr,
  deleteActivityFromDate,
  selectedDate,
  updateType,
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

  /* ****** delete doc instead of making frequency 0 ****** */
  if (
    updateType === "decrease" &&
    dateSpecificActivitiesPerformedAtArr?.length === 1
  ) {
    deleteActivityFromDate(activityId, dateSpecificActivitiesPerformedAtArr);
    return undefined;
  }

  const activity =
    activitiesList && findActivityById(activitiesList, activityId);
  if (!activity) return;
  const activitiesCollectionPerformedAtArr = activity.performedAt;

  /* ****** update firestore ****** */
  // TODO: update lastUpdatedAt
  if (updateType === "decrease") {
    // date-specific-activities-collection
    editFirestoreDoc({
      collectionRef: dateSpecificActivitiesCollectionRef,
      docId: activityId,
      updatedDoc: {
        performedAt: dateSpecificActivitiesPerformedAtArr.slice(0, -1),
      },
    });
    // activities-collection
    editFirestoreDoc({
      collectionRef: activitiesCollectionRef,
      docId: activityId,
      updatedDoc: {
        performedAt: getFilteredTimestampsArr(
          activitiesCollectionPerformedAtArr,
          [dateSpecificActivitiesPerformedAtArr.at(-1) as Timestamp]
        ),
      },
    });
  } else if (updateType === "increase") {
    const newTimestamp = getAppropriateTimestamp(selectedDate);

    // date-specific-activities-collection
    editFirestoreDoc({
      collectionRef: dateSpecificActivitiesCollectionRef,
      docId: activityId,
      updatedDoc: {
        performedAt: [...dateSpecificActivitiesPerformedAtArr, newTimestamp],
      },
    });
    // activities-collection
    editFirestoreDoc({
      collectionRef: activitiesCollectionRef,
      docId: activityId,
      updatedDoc: {
        performedAt: getSortedTimestampArr([
          ...activitiesCollectionPerformedAtArr,
          newTimestamp,
        ]),
      },
    });
  }
};
