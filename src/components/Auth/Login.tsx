import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import firebase, { auth } from "firebase-config/firebase";

const Login = () => {
  const theme = useTheme();

  const signinHandler = () => {
    auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  };

  const dummySigninHandler = () => {
    auth.signInWithEmailAndPassword("abc@def.com", "12341234");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
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
  );
};

export default Login;
