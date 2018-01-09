import { MIR_SET_TITLE, MIR_TWIST_LOAD } from "./constants";

export default (state = null, action) => {
  switch (action.type) {
    case MIR_SET_TITLE:
      return {
        ...state,
        title: action.title
      };
    case MIR_TWIST_LOAD:
      return {
        ...state,
        twist: action.twist
      };
    default:
      return state;
  }
};
