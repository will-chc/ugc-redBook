import React, { useEffect, useLayoutEffect, useState } from "react";
import { HeartOutlined, HeartTwoTone } from '@ant-design/icons';
import styles from './note.module.less';
import { Modal } from "antd";
interface noteCard {
    id:string,
    user_id:string,
    title:string,
    cover_image:string,
    userInfo:{
     nickName:string,
     avatar:string
    }
   }
interface FCprops {
    item: noteCard,
    showDetail: () => void,
}

const H1 = 266, H2=150;

const NoteItem: React.FC<FCprops> = ({ item, showDetail }) => {

    const [like, setLike] = useState(false);
    const [aspectRatio, setAspectRatio ] = useState(4/3); 

    // function
    const clickCover = (e: React.MouseEvent) => {
        e.preventDefault();
        showDetail();
    };
    const getTitle = (title:string) => {
        if(title.length> 20 ) return title.substring(0,20) + "...";
        return title;
    }
    useLayoutEffect(()=>{
        const img = new Image();
        img.src = item.cover_image;        
        setAspectRatio(img.naturalWidth/img.naturalHeight);
    },[]);
    return (
        <section className={styles['note-item']} >
            <div className={styles['cover']}
                onClick={clickCover}
                style={
                    {
                        height: aspectRatio < 1 ? H1 : H2,
                        background: `url('${item.cover_image}') left top 100% / 100% no-repeat`
                    }}
            >
                <img src={item.cover_image} />
            </div>
            <div className={styles['footer']} >
                <a className={styles['title']}><span>{getTitle(item.title)}</span></a>
                <div className={styles['author-wrapper']}>
                    <a className={styles['author']}>
                        <img src={item.userInfo.avatar} alt="" width={20} />
                        <span className={styles['name']}> {item.userInfo.nickName} </span>
                    </a>
                    <span className={styles['like-wrapper']} onClick={() => setLike(!like)}>
                        {!like
                            ? (<HeartOutlined className={styles['like']} />)
                            : (<HeartTwoTone twoToneColor='#cf1717' className={styles['like']} />)
                        }
                        <span>1</span>
                    </span>
                </div>
            </div>
        </section>
    );
};

export default NoteItem;