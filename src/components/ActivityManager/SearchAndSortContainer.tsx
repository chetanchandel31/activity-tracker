import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { QueryParamConfig, SetQuery } from "use-query-params";
import { SortOption, sortOptions } from "./helpers/getSortedActivities";

interface SearchAndSortContainerProps {
  searchTerm: string;
  setQuery: SetQuery<{
    search: QueryParamConfig<
      string | null | undefined,
      string | null | undefined
    >;
    sort: QueryParamConfig<
      string | null | undefined,
      string | null | undefined
    >;
  }>;
  sortType: SortOption;
}

const SearchAndSortContainer = (props: SearchAndSortContainerProps) => {
  const { searchTerm, setQuery, sortType } = props;

  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          mb: theme.spacing(3),
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          gap: theme.spacing(2),
        }}
      >
        <TextField
          onChange={({ target }) =>
            setQuery({ search: target.value || undefined })
          }
          placeholder="Search"
          size="small"
          sx={{ width: { xs: "100%", sm: theme.spacing(40) } }}
          InputProps={{
            endAdornment: (
              <SearchRoundedIcon sx={{ color: theme.palette.text.disabled }} />
            ),
          }}
          value={searchTerm || ""}
        />
        <TextField
          select
          label="Sort by"
          onChange={({ target }) =>
            setQuery({ sort: target.value || undefined })
          }
          size="small"
          sx={{ width: { xs: "100%", sm: theme.spacing(20) } }}
          value={sortType || ""}
        >
          {sortOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option || "none"}
            </MenuItem>
          ))}
        </TextField>
      </Box>
    </>
  );
};

export default SearchAndSortContainer;
