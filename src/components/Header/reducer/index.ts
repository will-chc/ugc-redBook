export const TYPE = {
    SET_USER_INFO: 'setUSerInfo'
}
interface init {
    email:string,
    nickName:string,
    avatar:string,
    brief:string | undefined,
    followData:{
        fansCount:number,
        followCount:number
    }
}
const initState:init = {
    email:'',
    nickName:'',
    avatar:'',
    brief:undefined,
    followData:{
        fansCount:0,
        followCount:0
    }
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