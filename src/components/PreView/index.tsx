import React, { useEffect, useState} from "react";
import styles from './index.module.less';
import NoteItem from '../../components/NoteItem';
import { FormInstance } from "antd";
interface FCprops {
    cover:string,
    title:string | undefined
}
const Preview:React.FC <FCprops>= ({cover, title}) => {
    const data = {
        id: '0000',
        type:'1',
        note_card: {
          cover: cover,
          title: '30岁未婚独居，一定要让自己有个温馨的小家',
          user: {
            nick_name: '王小仙',
            avatar: 'https://sns-avatar-qc.xhscdn.com/avatar/616e2c9c38d73a10f960b967.jpg?imageView2/2/w/540/format/webp',
            userId: '00000'
          },
          liked_info: {
            liked: false,
            liked_count: '0'
          }
        }
      }
      const [item,setItem] = useState(data);
      useEffect(()=>{
        const {note_card} = item 
        if(!title) title = '请先填写标题'
        setItem({...item,note_card:{...note_card,cover,title}});
        console.log(title);
        
      },[cover,title])
    return (
        <div className={styles['pre-wrapper']}>
            <div className={styles['header']}>预览</div>
            <div className={styles['pre-body']}>
                <NoteItem item={item} showDetail={()=>console.log(111)}/>
            </div>
        </div>
    );
};

export default Preview;