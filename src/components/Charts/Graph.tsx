import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { GraphData } from "types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface GraphProps {
  datasetLabel?: string;
  graphName?: string;
  graphData: GraphData;
}

const Graph = (props: GraphProps) => {
  const {
    datasetLabel = "Dataset 1",
    graphData,
    graphName = "Chart.js Line Chart",
  } = props;

  const theme = useTheme();

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: graphName,
      },
    },
    maintainAspectRatio: false,
  };

  const labels = graphData.xAxisData;
  const data = {
    labels,
    datasets: [
      {
        label: datasetLabel,
        data: graphData.yAxisData,
        borderColor: theme.palette.success.main,
        backgroundColor: theme.palette.success.dark,
      },
    ],
  };

  return (
    <Box sx={{ height: "570px" }}>
      <Line options={options} data={data} />
    </Box>
  );
};

export default Graph;
