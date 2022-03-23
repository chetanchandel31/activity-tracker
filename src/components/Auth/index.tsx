import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import firebase, { auth } from "firebase-config/firebase";
import { useState } from "react";
import { isElectron } from "utils";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

const Auth = () => {
  const theme = useTheme();

  const [isSignInScreen, setIsSignInScreen] = useState(true);

  const toggleSignInScreen = () => setIsSignInScreen((prev) => !prev);

  const signinHandler = () => {
    auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  };

  const dummySigninHandler = async () => {
    await auth.signInWithEmailAndPassword("abc@def.com", "12341234");
  };

  return (
    <Container
      sx={{
        pt: { xs: 20, sm: isElectron() ? 20 : 24 },
      }}
    >
      {isSignInScreen ? <SignIn /> : <SignUp />}

      <Box sx={{ textAlign: "center", mt: 1 }}>
        <Typography color="text.primary">
          {isSignInScreen ? (
            <>
              Don't have an account?{" "}
              <Button onClick={toggleSignInScreen}>sign up</Button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Button onClick={toggleSignInScreen}>sign in</Button>
            </>
          )}
        </Typography>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "center",
          gap: theme.spacing(2),
        }}
      >
        <Button onClick={signinHandler} variant="outlined">
          Google sign in
        </Button>
        <Button onClick={dummySigninHandler} variant="outlined">
          Continue as guest
        </Button>
      </Box>
    </Container>
  );
};

export default Auth;
