import firebase, { firestore } from "firebase-config/firebase";
import moment from "moment";
import { Activity, Timestamp } from "types";
import {
  deleteFirestoreDoc,
  editFirestoreDoc,
  findActivityById,
  getDateStringFromMoment,
} from "utils";
import { getFilteredTimestampsArr } from "./getFilteredTimestampsArr";

// TODO: can we reduce args if we directly take refs?

interface Args {
  activityId: string;
  activitiesList: Activity[] | null;
  dateSpecificActivitiesPerformedAtArr: Timestamp[];
  selectedDate: moment.Moment;
  user: firebase.User | null;
}

export const deleteActivityFromDate = ({
  activityId,
  activitiesList,
  dateSpecificActivitiesPerformedAtArr,
  selectedDate,
  user,
}: Args) => {
  const selectedDateString = getDateStringFromMoment(selectedDate);
  const activitiesCollectionRef = firestore.collection(
    `users/${user?.uid}/activities`
  );
  const dateSpecificActivitiesCollectionRef = firestore.collection(
    `users/${user?.uid}/dates/${selectedDateString}/date-specific-activities`
  );

  // activities-collection
  const activity = findActivityById(activitiesList, activityId);
  if (!activity) return;
  const activitiesCollectionPerformedAtArr = activity.performedAt;

  editFirestoreDoc({
    collectionRef: activitiesCollectionRef,
    docId: activityId,
    updatedDoc: {
      performedAt: getFilteredTimestampsArr(
        activitiesCollectionPerformedAtArr,
        dateSpecificActivitiesPerformedAtArr
      ),
    },
  });

  // date-specific-activities-collection
  deleteFirestoreDoc(dateSpecificActivitiesCollectionRef, activityId);
};
