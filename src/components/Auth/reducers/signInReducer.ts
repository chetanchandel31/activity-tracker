import { SIGN_IN_ACTION_TYPE } from "../actions";

export const initialSignInState = {
  email: "",
  password: "",
  doShowPassword: false,
  isLoading: false,
  error: "",
};

type SignInState = typeof initialSignInState;

export const signInReducer = (
  state: SignInState,
  action: SIGN_IN_ACTION_TYPE
): SignInState => {
  switch (action.type) {
    case "TOGGLE_SHOW_PASSWORD":
      return { ...state, doShowPassword: !state.doShowPassword };
    case "RESET_ERROR_AND_START_LOADING":
      return { ...state, isLoading: true, error: "" };
    case "END_LOADING":
      return { ...state, isLoading: false };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "SET_PASSWORD":
      return { ...state, password: action.payload };
    default:
      return { ...state };
  }
};
