import { CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import moment from "moment";
import { useEffect, useRef, useState } from "react";

interface Props {
  date: number | undefined;
  prefix?: string;
  suffix?: string;
}

const Stopwatch = ({ date, prefix = "", suffix = "" }: Props) => {
  const theme = useTheme();

  const [days, setDays] = useState<null | number>(null);
  const [hours, setHours] = useState<null | number>(null);
  const [minutes, setMinutes] = useState<null | number>(null);
  const [seconds, setSeconds] = useState<null | number>(null);

  const timeout = useRef<NodeJS.Timeout | null>(null);

  // eslint-disable-next-line
  useEffect(() => {
    if (date && moment().diff(moment.unix(date)) >= 0) {
      timeout.current = setTimeout(() => {
        setDays(() =>
          Math.floor(moment.duration(moment().diff(moment.unix(date))).asDays())
        );
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
      clearTimeout(timeout.current as NodeJS.Timeout);
    };
  }, []);

  const isLoaded =
    seconds !== null && hours !== null && minutes !== null && days !== null;

  return (
    <>
      {date && moment().diff(moment.unix(date)) >= 0 && isLoaded ? (
        <>
          {`${prefix}`}
          {days > 0 && `${days}d :`} {hours < 10 ? ` 0${hours}` : ` ${hours}`}h
          :{minutes < 10 ? ` 0${minutes}` : ` ${minutes}`}m :
          {seconds < 10 ? ` 0${seconds}` : ` ${seconds}`}s{`${suffix}`}
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
