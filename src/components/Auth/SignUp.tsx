import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { auth } from "firebase-config/firebase";
import { useState } from "react";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [doShowPassword, setDoShowPassword] = useState(false);
  const toggleShowPassword = () => setDoShowPassword((prev) => !prev);
  const [doShowConfirmPassword, setDoShowConfirmPassword] = useState(false);
  const toggleShowConfirmPassword = () =>
    setDoShowConfirmPassword((prev) => !prev);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async (email: string, password: string) => {
    try {
      setError("");
      setIsLoading(true);
      await auth.createUserWithEmailAndPassword(email, password);
    } catch (error: any) {
      console.log(error);
      setError(error?.message || "something went wrong");
    } finally {
      setIsLoading(false);
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
          onChange={({ target }) => setEmail(target.value)}
          size="small"
          value={email}
        />
        <TextField
          fullWidth
          InputProps={{
            endAdornment: (
              <IconButton onClick={toggleShowPassword} size="small">
                {doShowPassword ? (
                  <VisibilityRoundedIcon />
                ) : (
                  <VisibilityOffRoundedIcon />
                )}
              </IconButton>
            ),
          }}
          label="password"
          onChange={({ target }) => setPassword(target.value)}
          size="small"
          sx={{ mt: 2 }}
          type={doShowPassword ? "text" : "password"}
          value={password}
        />
        <TextField
          fullWidth
          InputProps={{
            endAdornment: (
              <IconButton onClick={toggleShowConfirmPassword} size="small">
                {doShowConfirmPassword ? (
                  <VisibilityRoundedIcon />
                ) : (
                  <VisibilityOffRoundedIcon />
                )}
              </IconButton>
            ),
          }}
          label="confirm password"
          onChange={({ target }) => setConfirmPassword(target.value)}
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
