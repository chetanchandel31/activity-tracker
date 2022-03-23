import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { auth } from "firebase-config/firebase";
import { useReducer } from "react";
import { initialSignUpState, signUpReducer } from "./reducers";

const SignUp = () => {
  const [
    {
      confirmPassword,
      doShowConfirmPassword,
      doShowPassword,
      email,
      error,
      isLoading,
      password,
    },
    dispatch,
  ] = useReducer(signUpReducer, initialSignUpState);

  const handleSignUp = async (email: string, password: string) => {
    try {
      dispatch({ type: "RESET_ERROR_AND_START_LOADING" });
      await auth.createUserWithEmailAndPassword(email, password);
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

  const doDisableButton =
    !email || !password || !confirmPassword || password !== confirmPassword;

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
          fullWidth
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
          label="password"
          onChange={({ target }) =>
            dispatch({ type: "SET_PASSWORD", payload: target.value })
          }
          size="small"
          sx={{ mt: 2 }}
          type={doShowPassword ? "text" : "password"}
          value={password}
        />
        <TextField
          fullWidth
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={() =>
                  dispatch({ type: "TOGGLE_SHOW_CONFIRM_PASSWORD" })
                }
                size="small"
              >
                {doShowConfirmPassword ? (
                  <VisibilityRoundedIcon />
                ) : (
                  <VisibilityOffRoundedIcon />
                )}
              </IconButton>
            ),
          }}
          label="confirm password"
          onChange={({ target }) =>
            dispatch({ type: "SET_CONFIRM_PASSWORD", payload: target.value })
          }
          onKeyDown={(e) => e.key === "Enter" && handleSignUp(email, password)}
          size="small"
          sx={{ mt: 2 }}
          type={doShowConfirmPassword ? "text" : "password"}
          value={confirmPassword}
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

        {password && confirmPassword && password !== confirmPassword && (
          <Typography
            color="error"
            sx={{ my: 1, textAlign: "center" }}
            variant="body2"
          >
            passwords don't match
          </Typography>
        )}

        <LoadingButton
          disabled={doDisableButton}
          fullWidth
          loading={isLoading}
          onClick={() => handleSignUp(email, password)}
          sx={{
            mt: 1,
          }}
          variant="contained"
        >
          Sign Up
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default SignUp;
