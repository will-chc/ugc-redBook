import React, { useEffect, useState } from "react";
import { HeartOutlined, HeartTwoTone } from '@ant-design/icons';
import styles from './note.module.less';
import { Modal } from "antd";
const NoteItem: React.FC = ({ item }) => {

    const { note_card } = item
    const [like, setLike] = useState(note_card.liked_info.liked);

    // function
    const stopDefault = (e: React.MouseEvent) => {
        e.preventDefault();
    }
    return (
        <section className={styles['note-item']}>
            <a className={styles['cover']}
                onClick={stopDefault}
                style={
                    {
                        height: item.type == 1 ? 266 : 150,
                        background: `url('${note_card.cover}') left top 100% / 100% no-repeat`
                    }}
            >
            </a>
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