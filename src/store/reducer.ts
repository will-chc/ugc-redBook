import { combineReducers } from "redux";
import editorReducer from "../page/Create/reducer";
import mapReducer from "../components/UAMap/reducer";
import DataChartReducer from "../page/DataChart/reducer";
import useInfoReducer from "../components/Header/reducer";
const rootReducer = combineReducers({
    textState:editorReducer,
    mapState:mapReducer,
    dataChartState:DataChartReducer,
    userInfo:useInfoReducer
});

export default rootReducer;