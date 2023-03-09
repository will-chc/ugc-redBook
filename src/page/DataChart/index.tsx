import React, { useEffect, useRef, useState } from "react";
import styles from './index.module.less';
import LNav from "../../components/Nav/LNav";
import { connect } from "react-redux";
import { changeNavStateACtion } from "./reducer/actions";

import FansData from "./components/FansData";
import { useSelector } from "react-redux";
import NoteData from "./components/NoteData";
const mapsStateToProps = (store: any) => ({
    key: store.dataChartState.navState
});
const mapDispatchToProps = {
    changeNavStateACtion
}

interface FCprops {
    changeNavStateACtion: (key: string) => any;
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
    const userId = '1892110220';
    const state = useSelector((store: any) => ({
        activedKey: store.dataChartState.navState
    }));


    return (
        <>
            <div className={styles['feeds-page']}>
                <div className={styles['fans-wrapper']}>
                    <div className={styles['avatar']}>
                        <img src="https://img.xiaohongshu.com/avatar/6222018f9c623248c224cd83.jpg@160w_160h_92q_1e_1c_1x.jpg" alt="" />
                    </div>
                    <div className={styles['info']}>
                        <div className={styles['nickName']}>雷欧娜</div>
                        <div className={styles['data-info']}>
                            <span className={styles['info']}>{32} </span> <span className={styles['item']}>关注</span>
                            <span className={styles['info']}>{1} </span> <span className={styles['item']}>粉丝</span>
                            <span className={styles['info']}>{0} </span> <span className={styles['item']}>获赞</span>

                            <span className={styles['line']}></span>
                            <span className={styles['item']}>小红书号：{userId}</span>

                        </div>
                        <div className={styles['desc']}>该用户暂时还没有简介</div>
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
                            <NoteData/>
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