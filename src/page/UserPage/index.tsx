import React, { useState } from "react";
import { Modal } from "antd";
import styles from './index.module.less';
import NoteItem from "../../components/NoteItem";
import NoteContent from "../../components/NoteContent";
import { NoteContext } from "../../Context";
const src = 'https://sns-avatar-qc.xhscdn.com/avatar/6222018f9c623248c224cd83.jpg?imageView2/2/w/540/format/webp';
const id = '188977898499';
const des = '做一个快乐的人'

// 示例数据
const data = {
    id: '63e4f47a0000000004006523',
    type: '2',
    note_card: {
        cover: 'https://sns-img-hw.xhscdn.com/00c73e32-22ad-c0a2-9898-3a36b977116c',
        title: '30岁未婚独居，一定要让自己有个温馨的小家',
        user: {
            nick_name: '王小仙',
            avatar: 'https://sns-avatar-qc.xhscdn.com/avatar/616e2c9c38d73a10f960b967.jpg?imageView2/2/w/540/format/webp',
            userId: '5ba715bd4610d200015b901a'
        },
        liked_info: {
            liked: false,
            liked_count: '1k+'
        }
    }
}
const data2 = {
    id: '63e4f47a0000000004006523',
    type: '1',
    note_card: {
        cover: 'https://sns-img-hw.xhscdn.com/9040ca79-22fb-14ea-43f0-401ab1088c75?imageView2/2/w/648/format/webp',
        title: '30岁未婚独居，一定要让自己有个温馨的小家',
        user: {
            nick_name: '王小仙',
            avatar: 'https://sns-avatar-qc.xhscdn.com/avatar/616e2c9c38d73a10f960b967.jpg?imageView2/2/w/540/format/webp',
            userId: '5ba715bd4610d200015b901a'
        },
        liked_info: {
            liked: false,
            liked_count: '1k+'
        }
    }
}
interface IFNoteItem {
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
//context
const NoteProvider = NoteContext.Provider;
const UserPage: React.FC = () => {
    const tabList = [
        {
            label: '笔记',
            key: 'note'
        },
        {
            label: '点赞',
            key: 'likes'
        },
    ]
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [curData, setaCurData] = useState(data); // 当前详情数据
    const [arr, setArr] = useState([...new Array(20).fill(data), ...new Array(15).fill(data2)]);
    const [tab, setTab] = useState('note');
    const getStyles = (key: string) => {
        if (key === tab) return [styles['tab'], styles['active']].join(" ");
        return styles['tab'];
    }
    //查看详细笔记
    const showDetail = (item: IFNoteItem) => {
        setaCurData(item);
        setIsModalOpen(true);
    };
    return (
        <div className={styles['feeds-page']}>
            <div className={styles['user']}>
                <div className={styles['userInfo']}>
                    <div className={styles['user-img']}>
                        <img src={src} alt="" />
                    </div>
                    <div className={styles['user-name']}>小红薯6117C604</div>
                    <div className={styles['user-id']}>小红书号：{id}</div>
                    <div className={styles['user-des']}>{des}</div>
                    <div className={styles['user-data']}>
                        <div className={styles['item']}>
                            <span className={styles['count']}>32</span>
                            <span className={styles['shows']}>关注</span>
                        </div>
                        <div className={styles['item']}>
                            <span className={styles['count']}>88</span>
                            <span className={styles['shows']}>粉丝</span>
                        </div>
                        <div className={styles['item']}>
                            <span className={styles['count']}>0</span>
                            <span className={styles['shows']}>点赞</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles['tab-list']}>
                {
                    tabList.map((t) => (
                        <div className={getStyles(t.key)} key={t.key} onClick={() => setTab(t.key)}>
                            <span className={styles['tab-text']}>{t.label}</span>
                        </div>
                    ))
                }
            </div>
            <div className={styles['feeds-page']}>
                <ul>
                    {arr.map((item) => {
                        return <NoteItem key={item.id + Math.random()} item={item} showDetail={() => showDetail(item)} />
                    })}
                </ul>
            </div>
            {
                isModalOpen
                    ? (
                        <Modal
                            maskStyle={{ backgroundColor: 'hsla(0,0%,97.6%,.98)' }}
                            title={null} open={isModalOpen}
                            onCancel={() => setIsModalOpen(false)}
                            footer={null}
                            width={800}
                            wrapClassName={styles['main-modal']}
                        >
                            <NoteProvider value={curData}>
                                <NoteContent data={data} />
                            </NoteProvider>
                        </Modal>
                    )
                    : null
            }
        </div>
    );
};

export default UserPage;