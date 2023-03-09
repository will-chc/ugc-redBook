
export const type = {
    CHANGE_NAV_STATE: "changeNavState"
};
const initState = {
    navState:''
}
const DataChartReducer = (state = initState, action:any) => {
    switch (action.type) {
        case type.CHANGE_NAV_STATE:
        return {...state, navState:action.navState}
        default:
            return state;
    };
};

export default DataChartReducer;