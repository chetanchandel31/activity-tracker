import { Button } from "@material-ui/core";
import firebase, { auth } from "../../firebase/firebase";

const Login = () => {
  const signinHandler = () => {
    auth.signInWithPopup(new auth.GoogleAuthProvider());
  };

  const dummySigninHandler = () => {
    auth.signInWithEmailAndPassword("abc@def.com", "12341234");
  };

  return (
    <div>
      <Button onClick={signinHandler} variant="outlined">
        Google sign in
      </Button>
      <Button onClick={dummySigninHandler} variant="outlined">
        Continue as guest
      </Button>
    </div>
  );
};

export default Login;
