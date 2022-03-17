import moment from "moment";

export const getFormattedDateForTooltip = (timestamp?: number) =>
  timestamp ? moment.unix(timestamp).format("LLL") : "";
