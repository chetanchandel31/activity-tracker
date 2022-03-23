export type SIGN_IN_ACTION_TYPE =
  | { type: "TOGGLE_SHOW_PASSWORD" }
  | { type: "RESET_ERROR_AND_START_LOADING" }
  | { type: "END_LOADING" }
  | { type: "SET_ERROR"; payload: string }
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_PASSWORD"; payload: string };
