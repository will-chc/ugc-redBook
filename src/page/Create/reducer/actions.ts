
import type from "./type";
const { CHANGE_TITLE,CHANGE_CONTENT} = type;

export const changeTitle = (title:string | undefined) => {
    return {
        type:CHANGE_TITLE,
        title
    }
};

export const changeContent = (content:string | undefined) => {
    return {
        type:CHANGE_CONTENT,
        content
    }
};