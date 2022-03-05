import { Box } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
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
  };

  const labels = graphData.xAxisData;
  const data = {
    labels,
    datasets: [
      {
        label: "Dataset 1",
        data: graphData.yAxisData,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      // {
      //   label: "Dataset 2",
      //   data: [78, 78, 22, 11, 75, 3, 56],
      //   borderColor: "rgb(53, 162, 235)",
      //   backgroundColor: "rgba(53, 162, 235, 0.5)",
      // },
    ],
  };

  return (
    <Box sx={{ border: "solid 1px black" }}>
      <Line options={options} data={data} />
    </Box>
  );
};

export default Graph;
