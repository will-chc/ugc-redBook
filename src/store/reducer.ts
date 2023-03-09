import { combineReducers } from "redux";
import editorReducer from "../page/Create/reducer";
import mapReducer from "../components/UAMap/reducer";
import DataChartReducer from "../page/DataChart/reducer";
const rootReducer = combineReducers({
    textState:editorReducer,
    mapState:mapReducer,
    dataChartState:DataChartReducer
});

export default rootReducer;