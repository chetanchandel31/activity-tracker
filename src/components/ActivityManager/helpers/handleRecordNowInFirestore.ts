import firebase, { firestore } from "firebase-config/firebase";
import moment from "moment";
import { Activity, DateSpeceficActivity } from "types";
import { editFirestoreDoc, getDateStringFromMoment } from "utils";
import { createNewFirestoreDoc } from "utils/createNewFirestoreDoc";
import { v4 as uuidv4 } from "uuid";

interface Args {
  activity: Activity;
  dateSpecificActivity: DateSpeceficActivity | undefined;
  isActivityAlreadyPerformedtoday: boolean;
  user: firebase.User | null;
}

export const handleRecordNowInFirestore = async ({
  activity,
  dateSpecificActivity,
  isActivityAlreadyPerformedtoday,
  user,
}: Args) => {
  if (!dateSpecificActivity) return;

  const currentDateString = getDateStringFromMoment(moment());
  const newTimestamp = {
    timestamp: moment().unix(),
    timestampId: `t-${uuidv4()}`,
  };

  const dateSpecificActivitiesCollectionRef = firestore.collection(
    `users/${user?.uid}/dates/${currentDateString}/date-specific-activities`
  );
  const activitiesCollectionRef = firestore.collection(
    `users/${user?.uid}/activities`
  );

  if (isActivityAlreadyPerformedtoday) {
    // date-specific-activities-collection
    await editFirestoreDoc({
      collectionRef: dateSpecificActivitiesCollectionRef,
      docId: activity.id,
      updatedDoc: {
        performedAt: [...dateSpecificActivity.performedAt, newTimestamp],
      },
    });
    // activities-collection
    await editFirestoreDoc({
      collectionRef: activitiesCollectionRef,
      docId: activity.id,
      updatedDoc: {
        performedAt: [...activity.performedAt, newTimestamp],
      },
    });
  } else {
    // date-specific-activities-collection
    await createNewFirestoreDoc({
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
    // activities-collection
    await editFirestoreDoc({
      collectionRef: activitiesCollectionRef,
      docId: activity.id,
      updatedDoc: {
        performedAt: [...activity.performedAt, newTimestamp],
      },
    });
  }
};
