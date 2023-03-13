import {TYPE} from './index';


interface userInfo {
    email:string,
    nickName:string,
    avatar:string,
    breif:string | undefined,
}
export const setUserInfo = (data:userInfo) => {
    return {
        payload:data,
        type:TYPE.SET_USER_INFO
    };
};