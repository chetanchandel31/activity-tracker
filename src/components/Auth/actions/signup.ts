export type SIGN_UP_ACTION_TYPE =
  | { type: "TOGGLE_SHOW_PASSWORD" }
  | { type: "TOGGLE_SHOW_CONFIRM_PASSWORD" }
  | { type: "RESET_ERROR_AND_START_LOADING" }
  | { type: "END_LOADING" }
  | { type: "SET_ERROR"; payload: string }
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_PASSWORD"; payload: string }
  | { type: "SET_CONFIRM_PASSWORD"; payload: string };
