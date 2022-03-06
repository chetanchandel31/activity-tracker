import { firestore } from "firebase-config/firebase";
import moment, { Moment } from "moment";
import { Activity, DateSpeceficActivity } from "types";

/**
 * substitute for moment().toDate().toLocaleDateString() to prevent inconsistent date string issue
 *
 * @param momentObj - object returned from moment's top level api
 * @returns a date string in such format: mm-dd-yyyy
 *
 */
export const getDateStringFromMoment = (momentObj: Moment) => {
  const month = momentObj.toDate().getMonth() + 1;
  const day = momentObj.toDate().getDate();
  const year = momentObj.toDate().getFullYear();

  const dateArr = [String(month), String(day), String(year)];

  return dateArr
    .map((el) => {
      if (el.length === 1) el = "0" + el;
      return el;
    })
    .join("-");
};

/**
 * get list of dates between any 2 dates
 *
 * @param startDate - start date
 * @param endDate - end date
 * @returns list of dates between 2 dates
 *
 */
export const getDaysBetween2Dates = (startDate: Moment, endDate: Moment) => {
  const now = startDate.clone();
  const dates = [];

  while (now.isSameOrBefore(endDate)) {
    dates.push(getDateStringFromMoment(now));
    now.add(1, "days");
  }
  return dates;
};

/**
 * get firestore docs without subscribing to live changes in a firestore collection
 *
 * @param collection - firestore collection path. e.g. "users/uid/todos"
 * @returns all firestore docs in that collection
 *
 */
export const getAllFirestoreDocs = async (collection: string) => {
  const docs: any = [];

  await firestore
    .collection(collection)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        docs.push({ ...doc.data(), id: doc.id });
      });
    });

  return docs;
};

type ActivityObj = Activity | DateSpeceficActivity;

export const findActivityById = (list: ActivityObj[], id: string) =>
  list.find((el) => el.id === id);

export const findActivityByName = (list: Activity[] | null, name: string) =>
  list?.find((el) => el.name === name);

export const getFormattedDateForTooltip = (timestamp?: number) =>
  timestamp ? moment.unix(timestamp).format("LLL") : "";
