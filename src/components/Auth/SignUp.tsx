import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { auth } from "firebase-config/firebase";
import { useState } from "react";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (email: string, password: string) => {
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

  // TODO: show password
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
          label="password"
          sx={{ mt: 2 }}
          type="password"
          fullWidth
          onChange={({ target }) => setPassword(target.value)}
          size="small"
          value={password}
        />
        <TextField
          label="confirm password"
          sx={{ mt: 2 }}
          type="password"
          fullWidth
          onChange={({ target }) => setConfirmPassword(target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSignIn(email, password)}
          size="small"
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
          onClick={() => handleSignIn(email, password)}
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
