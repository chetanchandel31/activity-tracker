import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { GraphData } from "types";
import ReactECharts from "echarts-for-react";

interface GraphProps {
  datasetLabel?: string;
  graphData: GraphData;
}

const Graph = (props: GraphProps) => {
  const { datasetLabel = "Dataset 1", graphData } = props;

  const theme = useTheme();

  const _options = {
    backgroundColor: theme.palette.background.default,
    color: ["#4DB6AC", "#FF8A65", "#FFB74D"],
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: [datasetLabel],
      y: "bottom",
      type: "scroll",
      orient: "horizontal",
    },
    toolbox: {
      show: true,
      orient: "vertical",
      feature: {
        magicType: { show: true, type: ["line", "bar"] },
        saveAsImage: { show: true },
      },
    },
    calculable: true,
    xAxis: [
      {
        type: "category",
        data: graphData.xAxisData,
      },
    ],
    yAxis: [
      {
        type: "value",
      },
    ],
    series: [
      {
        name: datasetLabel,
        type: "line",
        data: graphData.yAxisData,
        markPoint: {
          data: [
            { type: "max", name: "Max" },
            { type: "min", name: "Min" },
          ],
        },
        markLine: {
          data: [{ type: "average", name: "Avg" }],
        },
      },
    ],
  };

  return (
    <Box sx={{ height: "570px" }}>
      <div>
        <ReactECharts theme={theme.palette.mode} option={_options} />
      </div>
    </Box>
  );
};

export default Graph;
