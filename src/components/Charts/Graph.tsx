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
  graphData: GraphData;
}

const Graph = ({ graphData }: GraphProps) => {
  const theme = useTheme();

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Chart.js Line Chart",
      },
    },
    maintainAspectRatio: false,
  };

  const labels = graphData.xAxisData;
  const data = {
    labels,
    datasets: [
      {
        label: "Dataset 1",
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
