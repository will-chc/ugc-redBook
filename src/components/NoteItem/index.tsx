import React, { useEffect, useState } from "react";
import { HeartOutlined, HeartTwoTone } from '@ant-design/icons';
import styles from './note.module.less';
import { Modal } from "antd";
interface FCprops {
    item: {
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
    },
    showDetail: () => void;
}
const NoteItem: React.FC<FCprops> = ({ item, showDetail }) => {

    const { note_card } = item
    const [like, setLike] = useState(note_card.liked_info.liked);

    // function
    const clickCover = (e: React.MouseEvent) => {
        e.preventDefault();
        showDetail();
    }
    return (
        <section className={styles['note-item']}>
            <span className={styles['cover']}
                onClick={clickCover}
                style={
                    {
                        height: item.type == "1" ? 266 : 150,
                        background: `url('${note_card.cover}') left top 100% / 100% no-repeat`
                    }}
            >
            </span>
            <div className={styles['footer']} >
                <a className={styles['title']}><span>{note_card.title}</span></a>
                <div className={styles['author-wrapper']}>
                    <a className={styles['author']}>
                        <img src={note_card.user.avatar} alt="" width={20} />
                        <span className={styles['name']}> {note_card.user.nick_name} </span>
                    </a>
                    <span className={styles['like-wrapper']} onClick={() => setLike(!like)}>
                        {!like
                            ? (<HeartOutlined className={styles['like']} />)
                            : (<HeartTwoTone twoToneColor='#cf1717' className={styles['like']} />)
                        }
                        <span>{note_card.liked_info.liked_count}</span>
                    </span>
                </div>
            </div>
        </section>
    );
};

export default NoteItem;