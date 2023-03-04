import type from "./type";
const { CHANGE_TITLE, CHANGE_CONTENT } = type;

interface editStore {
    title: string | undefined,
    content: string | undefined
}
const initEditStore: editStore = {
    title: undefined,
    content: undefined
}
const editorReducer = (store = initEditStore, action: any) => {
    switch (action.type) {
        case CHANGE_TITLE:
            return { ...store, title: action.title };
        case CHANGE_CONTENT:
            return { ...store, content: action.content }
        default:
            return store;
    }
}

export default editorReducer;