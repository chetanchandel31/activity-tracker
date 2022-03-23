import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { auth } from "firebase-config/firebase";
import { useReducer } from "react";
import { initialSignInState, signInReducer } from "./reducers";

const SignIn = () => {
  const [{ doShowPassword, email, error, isLoading, password }, dispatch] =
    useReducer(signInReducer, initialSignInState);

  const handleSignIn = async (email: string, password: string) => {
    try {
      dispatch({ type: "RESET_ERROR_AND_START_LOADING" });
      await auth.signInWithEmailAndPassword(email, password);
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: "SET_ERROR",
        payload: error?.message || "something went wrong",
      });
    } finally {
      dispatch({ type: "END_LOADING" });
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Box sx={{ width: "90%", maxWidth: "600px" }}>
        <TextField
          label="email"
          type="email"
          fullWidth
          onChange={({ target }) =>
            dispatch({ type: "SET_EMAIL", payload: target.value })
          }
          size="small"
          value={email}
        />
        <TextField
          label="password"
          sx={{ mt: 2 }}
          type={doShowPassword ? "text" : "password"}
          fullWidth
          onChange={({ target }) =>
            dispatch({ type: "SET_PASSWORD", payload: target.value })
          }
          onKeyDown={(e) => e.key === "Enter" && handleSignIn(email, password)}
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={() => dispatch({ type: "TOGGLE_SHOW_PASSWORD" })}
                size="small"
              >
                {doShowPassword ? (
                  <VisibilityRoundedIcon />
                ) : (
                  <VisibilityOffRoundedIcon />
                )}
              </IconButton>
            ),
          }}
          size="small"
          value={password}
        />

        {error && (
          <Typography
            color="error"
            sx={{ my: 1, textAlign: "center" }}
            variant="body2"
          >
            {error}
          </Typography>
        )}

        <LoadingButton
          disabled={!email || !password}
          fullWidth
          loading={isLoading}
          onClick={() => handleSignIn(email, password)}
          sx={{
            mt: 1,
          }}
          variant="contained"
        >
          Sign In
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default SignIn;
