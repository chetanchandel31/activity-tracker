import moment from "moment";

export const areTwoDatesSame = (
  firstDate: moment.Moment,
  secondDate: moment.Moment
) =>
  firstDate.toDate().toLocaleDateString() ===
  secondDate.toDate().toLocaleDateString();
