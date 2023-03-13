export const TYPE = {
    SET_USER_INFO: 'setUSerInfo'
}
interface init {
    email:string,
    nickName:string,
    avatar:string,
    brief:string | undefined,
}
const initState:init = {
    email:'',
    nickName:'',
    avatar:'',
    brief:undefined
}
const useInfoReducer = (state=initState, action: any) => {
    switch (action.type) {
        case TYPE.SET_USER_INFO:
            return { ...state, ...action.payload };
        default:
            return state;
    }
};

export default useInfoReducer;