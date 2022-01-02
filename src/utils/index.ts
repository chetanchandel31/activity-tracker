import { Moment } from "moment";

/**
 * avoid inconsistenct date string issue while using from moment().toDate().toLocaleDateString()
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
