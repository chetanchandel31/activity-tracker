import {
  getGraphDataLastNDays,
  LAST_15_DAYS,
  LAST_30_DAYS,
  LAST_7_DAYS,
} from "components/Charts/helpers/getGraphDataLastNDays";
import { useEffect, useState } from "react";
import { Activity, GraphData } from "types";
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

  const [graphData, setGraphData] = useState<GraphData>({
    xAxisData: [],
    yAxisData: [],
  });
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
        const graphDataLast7Days = await getGraphDataLastNDays({
          selectedActivityId,
          user,
        });
        setGraphData(graphDataLast7Days);
      } else if (selectedDuration === LAST_15_DAYS) {
        const graphDataForCurrentWeek = await getGraphDataLastNDays({
          n: 15,
          selectedActivityId,
          user,
        });
        setGraphData(graphDataForCurrentWeek);
      } else if (selectedDuration === LAST_30_DAYS) {
        const graphDataForCurrentWeek = await getGraphDataLastNDays({
          n: 30,
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
