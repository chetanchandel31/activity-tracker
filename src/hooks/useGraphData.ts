import { LAST_7_DAYS, THIS_WEEK } from "components/Charts";
import { getGraphDataLast7Days } from "components/Charts/helpers/getGraphDataLast7Days";
import { useEffect, useState } from "react";
import { Activity } from "types";
import { findActivityByName } from "utils";
import useAuthListener from "./useAuthListener";

interface UseGraphDataArgs {
  activitiesList: Activity[] | null;
  selectedActivity: string;
  selectedDuration: string;
}

/** returns data for `Chart.js`'s components */
const useGraphData = ({
  activitiesList,
  selectedActivity,
  selectedDuration,
}: UseGraphDataArgs) => {
  const [user] = useAuthListener();

  const [graphData, setGraphData] = useState<{
    xAxisData: string[];
    yAxisData: number[];
  }>({ xAxisData: [], yAxisData: [] });
  const [graphDataError, setGraphDataError] = useState("");
  const [isGraphDataLoading, setIsGraphDataloading] = useState(false);

  const areSelectedDropdownFieldsValid = (selectedActivityId?: string) => {
    if (!selectedDuration && !selectedActivityId)
      setGraphDataError("Please select a duration and valid activity");
    else if (!selectedDuration) setGraphDataError("Please select a duration");
    else if (!selectedActivityId)
      setGraphDataError("Please select a valid activity");
    else setGraphDataError("");

    return selectedDuration && selectedActivityId;
  };

  const updateGraphData = async (selectedActivityId: string) => {
    if (!user) return;

    setIsGraphDataloading(true);
    try {
      if (selectedDuration === LAST_7_DAYS) {
        const graphDataLast7Days = await getGraphDataLast7Days({
          selectedActivityId,
          user,
        });
        setGraphData(graphDataLast7Days);
      } else if (selectedDuration === THIS_WEEK) {
        // TODO: new helper here when ready
        const graphDataForCurrentWeek = await getGraphDataLast7Days({
          selectedActivityId,
          user,
        });
        setGraphData(graphDataForCurrentWeek);
      } else {
        setGraphDataError("something went wrong");
        console.error(
          "probably a new option has been added to duration dropdown which isn't taken into account"
        );
      }
    } catch (err) {
      console.log(err, "#us898");
    } finally {
      setIsGraphDataloading(false);
    }
  };

  useEffect(() => {
    const selectedActivityId = findActivityByName(
      activitiesList,
      selectedActivity
    )?.id;

    if (!areSelectedDropdownFieldsValid(selectedActivityId)) return;

    updateGraphData(selectedActivityId as string); // it'll anyway always be string because of above validation
    // eslint-disable-next-line
  }, [selectedActivity, selectedDuration]);

  return { graphData, graphDataError, isGraphDataLoading };
};

export default useGraphData;
