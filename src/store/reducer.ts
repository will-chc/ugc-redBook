import { combineReducers } from "redux";
import editorReducer from "../page/Create/reducer";
import mapReducer from "../components/UAMap/reducer";
const rootReducer = combineReducers({
    textState:editorReducer,
    mapState:mapReducer
});

export default rootReducer;