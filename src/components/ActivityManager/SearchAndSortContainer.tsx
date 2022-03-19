import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { Dispatch, SetStateAction } from "react";
import { SortOption, sortOptions } from "./helpers/getSortedActivities";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

interface SearchAndSortContainerProps {
  searchTerm: string;
  setSortType: Dispatch<SetStateAction<SortOption>>;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  sortType: SortOption;
}

const SearchAndSortContainer = (props: SearchAndSortContainerProps) => {
  const { searchTerm, setSearchTerm, setSortType, sortType } = props;

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
          onChange={({ target }) => setSearchTerm(target.value)}
          placeholder="Search"
          size="small"
          sx={{ width: { xs: "100%", sm: theme.spacing(40) } }}
          InputProps={{
            endAdornment: (
              <SearchRoundedIcon sx={{ color: theme.palette.text.disabled }} />
            ),
          }}
          value={searchTerm}
        />
        <TextField
          select
          label="Sort by"
          onChange={({ target }) => setSortType(target.value as SortOption)}
          size="small"
          sx={{ width: { xs: "100%", sm: theme.spacing(20) } }}
          value={sortType}
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
