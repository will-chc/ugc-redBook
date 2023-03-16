import {TYPE} from './index';


interface userInfo {
    email:string,
    nickName:string,
    avatar:string,
    breif:string | undefined,
    followData:{
        fansCount:number,
        followCount:number
    }
}
export const setUserInfo = (data:userInfo) => {
    return {
        payload:data,
        type:TYPE.SET_USER_INFO
    };
};