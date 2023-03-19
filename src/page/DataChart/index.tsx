import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from './index.module.less';
import LNav from "../../components/Nav/LNav";
import { connect } from "react-redux";
import { changeNavStateACtion } from "./reducer/actions";

import FansData from "./components/FansData";
import { useSelector } from "react-redux";
import NoteData from "./components/NoteData";
import request from "../../server/request";
const mapsStateToProps = (store: any) => ({
    key: store.dataChartState.navState
});
const mapDispatchToProps = {
    changeNavStateACtion
}

interface FCprops {
    changeNavStateACtion: (key: string) => any;
}
interface DataInfo {
    follow_count: number,
    fans_count: number,
    like_count: number,
}
interface Count {
    count:number
}

const DataChart: React.FC<FCprops> = ({ changeNavStateACtion }) => {

    const chart_nav = [
        {
            label: '粉丝数据',
            key: "fans"
        },
        {
            label: '作品数据',
            key: "note"
        },
    ]
    const state = useSelector((store: any) => ({
        activedKey: store.dataChartState.navState,
        userInfo: store.userInfo
    }));
    const { userInfo } = state;
    const [info, setInfo] = useState<DataInfo>({
        follow_count: 0,
        fans_count: 0,
        like_count: 0
    });


    useLayoutEffect(() => {
        const user_id = localStorage.getItem('userId');
        Promise.all([
            request('/follow_count', { user_id }),
            request('/fans_count', { user_id }),
            request('/like_count', { user_id }),
        ]).then(([followRes, fansRes, likeRes]) => {
            const follow_count = followRes as Count;
            const fans_count = fansRes as Count;
            const like_count = likeRes as Count;
            setInfo({
                follow_count: follow_count.count,
                fans_count: fans_count.count,
                like_count: like_count.count,
            });            
        });
    }, []);


    return (
        <>
            <div className={styles['feeds-page']}>
                <div className={styles['fans-wrapper']}>
                    <div className={styles['avatar']}>
                        <img src={userInfo.avatar} alt="" />
                    </div>
                    <div className={styles['info']}>
                        <div className={styles['nickName']}>{userInfo.nickName}</div>
                        <div className={styles['data-info']}>
                            <span className={styles['info']}>{info.follow_count} </span> <span className={styles['item']}>关注</span>
                            <span className={styles['info']}>{info.fans_count} </span> <span className={styles['item']}>粉丝</span>
                            <span className={styles['info']}>{info.like_count} </span> <span className={styles['item']}>获赞</span>
                            <span className={styles['line']}></span>
                            <span className={styles['item']}>小红书号：{localStorage.getItem('userId')}</span>

                        </div>
                        <div className={styles['desc']}>{userInfo.brief ? userInfo.brief : "该用户暂时还没有简介"}</div>
                    </div>
                </div>
                <div className={styles['chart-wrapper']}>
                    <div className={styles['chart-nav']}>
                        <LNav nav={chart_nav} changeKey={changeNavStateACtion} />
                    </div>
                    {
                        state.activedKey == 'fans' && (
                            <FansData />
                        )
                    }
                    {
                        state.activedKey == 'note' && (
                            <NoteData likeTotal={info.like_count}/>
                        )
                    }
                </div>
            </div>
        </>
    )
};

// export default DataChart;
export default connect(mapsStateToProps, mapDispatchToProps)(DataChart);
{ }