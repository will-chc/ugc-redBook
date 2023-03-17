import { combineReducers } from "redux";
import editorReducer from "../page/Create/reducer";
import mapReducer from "../components/UAMap/reducer";
import DataChartReducer from "../page/DataChart/reducer";
import useInfoReducer from "../components/Header/reducer";
import headerReducer from "../components/Header/reducer/headerReducer";
const rootReducer = combineReducers({
    textState:editorReducer,
    mapState:mapReducer,
    dataChartState:DataChartReducer,
    userInfo:useInfoReducer,
    headerState:headerReducer
});

export default rootReducer;