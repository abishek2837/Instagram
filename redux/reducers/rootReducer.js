import { combineReducers } from "redux";
import addPostReducer from "./addPostReducer";
import profileReducer from "./profileReducer";

export default combineReducers({
    addPostReducer,
    profileReducer
});