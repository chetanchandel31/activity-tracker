import { useTheme } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { ReactNode } from "react";

const ActivitiesTable = ({ children }: { children: ReactNode }) => {
  const theme = useTheme();

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell width="421">
              <Typography sx={{ pl: theme.spacing(4) }}>
                <strong>Activity</strong>
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography>
                <strong>Last performed</strong>
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography>
                <strong>Tracking since</strong>
              </Typography>
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>{children}</TableBody>
      </Table>
    </TableContainer>
  );
};

export default ActivitiesTable;
