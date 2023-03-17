export const headerType = {
    SET_PATH: 'setPath'
}
interface init {
    path:string
}
const headerReducer = (state={path:'/explore'}, action: any) => {
    switch (action.type) {
        case headerType.SET_PATH:
            return {...state, path: action.path };
        default:
            return state;
    }
};

export default headerReducer;