import React from "react";
interface IFNoteContext {
    id: string,
    type: string,
    note_card: {
        cover: string,
        title: string,
        user: {
            nick_name: string,
            avatar: string,
            userId: string
        },
        liked_info: {
            liked: boolean,
            liked_count: string
        }
    }

}
export const NoteContext = React.createContext<IFNoteContext>({
    id:'',
    type:'',
    note_card:{
        cover:'',
        title:'',
        user:{
            nick_name:'',
            avatar:'',
            userId:'',
        },
        liked_info:{
            liked:false,
            liked_count:''
        }
    }
});


