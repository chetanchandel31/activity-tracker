import { CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import moment from "moment";
import { useEffect, useRef, useState } from "react";

const Stopwatch = ({ date }) => {
  const theme = useTheme();

  const [days, setDays] = useState(null);
  const [hours, setHours] = useState(null);
  const [minutes, setMinutes] = useState(null);
  const [seconds, setSeconds] = useState(null);

  const timeout = useRef();

  // eslint-disable-next-line
  useEffect(() => {
    if (moment().diff(moment.unix(date)) >= 0) {
      timeout.current = setTimeout(() => {
        setDays(() => moment.duration(moment().diff(moment.unix(date))).days());
        setHours(() =>
          moment.duration(moment().diff(moment.unix(date))).hours()
        );
        setMinutes(() =>
          moment.duration(moment().diff(moment.unix(date))).minutes()
        );
        setSeconds(() =>
          moment.duration(moment().diff(moment.unix(date))).seconds()
        );
      }, 1000);

      return undefined;
    }
    setDays(0);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
  });

  // avoiding memory leak
  useEffect(() => {
    return () => {
      clearTimeout(timeout.current);
    };
  }, []);

  return (
    <>
      {date && moment().diff(moment.unix(date)) >= 0 && seconds !== null ? (
        <>
          {days > 0 && `${days}d :`} {hours < 10 ? ` 0${hours}` : ` ${hours}`}h
          :{minutes < 10 ? ` 0${minutes}` : ` ${minutes}`}m :
          {seconds < 10 ? ` 0${seconds}` : ` ${seconds}`}s
        </>
      ) : (
        <CircularProgress
          size={20}
          sx={{ color: theme.palette.text.secondary, ml: 1 }}
        />
      )}
    </>
  );
};

export default Stopwatch;
