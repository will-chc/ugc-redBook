import React, { useEffect, useState } from "react";
import { Divider, Modal } from "antd";
import styles from './index.module.less';
import NoteItem from "../../components/NoteItem";
import NoteContent from "../../components/NoteContent";
import { NoteContext } from "../../Context";
import { useSelector } from "react-redux";
import request from "../../server/request";
import { useHistory } from "react-router-dom";

const H1 = 266, H2 = 150;


interface noteCard {
    id: string,
    user_id: string,
    title: string,
    liked:boolean,
    cover_image: string,
    userInfo: {
        nickName: string,
        avatar: string
    }
}

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
    ];
    const topArr: number[] = [0, 0, 0, 0, 0];



    const [userInfo, setUserInfo] = useState({
        email: "",
        nickName: '',
        avatar: '',
        brief: undefined
        ,
    });

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [column, setColumn] = useState(5);


    const [curData, setaCurData] = useState<noteCard>({
        id: '',
        user_id: '',
        title: '',
        cover_image: '',
        liked:false,
        userInfo: {
            nickName: '',
            avatar: ''
        }
    });
    // 当前详情数据
    const [arr, setArr] = useState<noteCard[]>([]);

    const [tab, setTab] = useState('note');

    const [page, setPage] = useState(1);

    const [hasNextPage, setHasNextPage] = useState(true);




    const history = useHistory();
    const { pathname } = history.location;
    const queryArr = pathname.split('/');
    const user_id = queryArr[queryArr.length - 1];

    //动态类名
    const getStyles = (key: string) => {
        if (key === tab) return [styles['tab'], styles['active']].join(" ");
        return styles['tab'];
    }
    //查看详细笔记
    const showDetail = (item: noteCard) => {
        setaCurData(item);
        setIsModalOpen(true);
    };

    useEffect(() => {

        request('/userInfo', { user_id }).then((res: any) => {
            setUserInfo(res);
        })
        request('/note_list', { user_id, page }).then((res: any) => {
            setArr(res.resultList);
        });
    }, []);
    useEffect(() => {
        // 监听滚动
        document.addEventListener('scroll', loadNext);
        return () => {
            document.removeEventListener("scroll", loadNext);
        }
    }, [arr]);

    // 滚动加载
    const loadNext = () => {
        if (!hasNextPage) return;
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const clientHeight = document.documentElement.clientHeight;
        const scrollHeight = document.documentElement.scrollHeight;
        if (scrollTop + clientHeight + 600 >= scrollHeight) {
            // 请求数据
            request('/note_list', { user_id, page: page + 1 }).then((res: any) => {
                const { resultList, hasNextPage } = res;
                setHasNextPage(hasNextPage);
                const newArr = [...arr, ...resultList];
                setArr(newArr);
                setPage(page + 1);
            });
        }
    }

    const getTop = (i: number, col: number, item: noteCard) => {
        const top = topArr[col];
        const img = new Image();
        img.src = item.cover_image;
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        topArr[col] += (aspectRatio < 1 ? H1 : H2) + 100;
        return top;
    }

    return (
        <div className={styles['feeds-page']}>
            <div className={styles['user']}>
                <div className={styles['userInfo']}>
                    <div className={styles['user-img']}>
                        <img src={userInfo.avatar} alt="" />
                    </div>
                    <div className={styles['user-name']}>{userInfo.nickName}</div>
                    <div className={styles['user-id']}>小红书号：{localStorage.getItem('userId')}</div>
                    <div className={styles['user-des']}>{userInfo.brief ? userInfo.brief : '尚未有简介'}</div>
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
                {arr.map((item, i) => {
                    return <div style={{
                        position: "absolute",
                        top: getTop(Math.ceil((i + 1) / column), i % column, item) + 88,
                        left: (i % column) * 240 + 42,
                    }}
                    key={item.id + Math.random()}
                    >
                        <NoteItem key={item.id + Math.random()} item={item} showDetail={() => showDetail(item)} />
                    </div>

                })}
                {
                    !hasNextPage && (<div className={styles['bottom']}>已经到底了！</div>)
                }
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
                            <NoteContent data={curData} />
                        </Modal>
                    )
                    : null
            }
        </div >
    );
};

export default UserPage;