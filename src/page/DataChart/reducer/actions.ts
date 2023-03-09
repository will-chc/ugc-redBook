import { type } from "./index"

export const changeNavStateACtion = (navState:string) => ({
    type:type.CHANGE_NAV_STATE,
    navState
});
