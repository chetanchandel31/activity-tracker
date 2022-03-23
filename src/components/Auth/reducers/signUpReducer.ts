import { SIGN_UP_ACTION_TYPE } from "../actions/signup";

export const initialSignUpState = {
  email: "",
  password: "",
  confirmPassword: "",
  doShowPassword: false,
  doShowConfirmPassword: false,
  isLoading: false,
  error: "",
};

type SignUpState = typeof initialSignUpState;

export const signUpReducer = (
  state: SignUpState,
  action: SIGN_UP_ACTION_TYPE
): SignUpState => {
  switch (action.type) {
    case "TOGGLE_SHOW_CONFIRM_PASSWORD":
      return { ...state, doShowConfirmPassword: !state.doShowConfirmPassword };
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
    case "SET_CONFIRM_PASSWORD":
      return { ...state, confirmPassword: action.payload };
    default:
      return { ...state };
  }
};
