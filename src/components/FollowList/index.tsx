import React, { useEffect, useState } from "react";
import { Modal, Button } from "antd";

import styles from './index.module.less';
import request from "../../server/request";
interface FCprops {
    isOpen: boolean,
    setOpen: (open: boolean) => void,
    acticedKey: string,
    setActivedKey: (key: string) => void,
    user_id: string
}
const FollowList: React.FC<FCprops> = ({ isOpen, setOpen, acticedKey, setActivedKey, user_id }) => {

    const [followList, setFollowList] = useState<any[]>([]);
    const [fansList, setFansList] = useState<any[]>([]);
    const [list, setList] = useState<any[]>([]);


    useEffect(() => {
        // 获取关注列表
        request('/follow_list', { user_id }).then((res: any) => {
            const { followList } = res;
            setFollowList(followList);
            if (acticedKey == 'follow') setList(followList);
        });
        // 获取粉丝列表
        request('/fans_list', { user_id }).then((res: any) => {
            const { fansList } = res;
            setFansList(fansList);
            if (acticedKey == 'fans') setList(fansList);

        });
    }, []);
    useEffect(() => {
        if (acticedKey == 'follow') {
            setList(followList);
        } else {
            setList(fansList);
        }
    }, [acticedKey]);
    const getStyles = (key: string) => {
        const className = styles['tab'];
        if (key == acticedKey) return className + ' ' + styles['actived'];
        return className;
    };
    const title = (
        <div className={styles['tabs']}>
            <div className={getStyles("follow")} onClick={() => setActivedKey('follow')}>关注列表</div>
            <div className={getStyles('fans')} onClick={() => setActivedKey('fans')}>粉丝列表</div>
        </div>
    );

    return (
        <Modal
            title={title}
            open={isOpen}
            onCancel={() => { setOpen(false) }}
            wrapClassName={styles['list-modal']}
        >
            <List user_id={user_id} list={list} setList={setList} />
        </Modal>
    )
}
export default FollowList;
interface listProps {
    user_id: string,
    list: any[],
    setList: (list: any[]) => void
}
const List: React.FC<listProps> = ({ user_id, list, setList }) => {

    const handleFollow = (new_follow: boolean, index: number, followee_id: number) => {

        list[index].followed = new_follow;
        setList([...list]);
        request('follow', { follower_id: user_id, followee_id }, 'post').then(res => {
        });
    }
    return (
        <>
            <div className={styles['list']}>
                {
                    list.map((item, i) => (
                        <div className={styles['list-item']} key={item.user_id}>
                            <div className={styles['info']}>
                                <div className={styles['avatar']}>
                                    <img src={item.avatar} />
                                </div>
                                <div className={styles['nick-name']}>{item.nickName}</div>
                            </div>

                            {item.followed
                                ? <Button className={styles['follow']} onClick={() => { handleFollow(false, i, item.user_id) }}>已关注</Button>
                                : <Button className={styles['unfollow']} onClick={() => { handleFollow(true, i, item.user_id) }}>关注</Button>
                            }
                        </div>
                    ))
                }

            </div>
            {
                list.length === 0 && (
                    <div className={styles['none']}>这里空空如也</div>
                )
            }
        </>

    )
}