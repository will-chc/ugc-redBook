import React, { useLayoutEffect, useState } from "react";
import { Select, Switch } from "antd";
import styles from './index.module.less';
import RoseChart from "../RoseChart";
import LineChart from "../LineChart";
import HistorgamChart from "../HistorgamChart";
import request from "../../../../server/request";
interface NewFans {
    date:string,
    new_fans:number
}
interface Gender {
    gender:string,
    count:number
}
const FansData: React.FC = () => {
    const [isLine, setIsLine] = useState(true);

    const selectOption = [
        {
            label: '新增粉丝数',
            value: 'fansAdd'
        },
        {
            label: '粉丝成分',
            value: 'fansClass'
        },
    ];
    const [newFans, setNewFans] = useState<NewFans[]>([]);
    const [ gender, setGender ] = useState<Gender[]>([])
    useLayoutEffect(() => {
        const user_id = localStorage.getItem('userId');
        request('/add_fans_data', { user_id }).then((res: any) => {
            const { dataList } = res;
            setNewFans(dataList);
        });
        request('/fans_gender',{user_id}).then((res:any)=>{
            const { gender } = res;
            setGender(gender);
        })
    }, []);

    return (
        <div className={styles['wrapper']}>
            <div className={styles['add-wrapper']}>
                <div className={styles['header']}> 近7天 粉丝量
                </div>
                <div className={styles['left-chart']}>
                    <div className={styles['switch']}>
                        <Switch checkedChildren="切换折线图" unCheckedChildren="切换柱状图" checked={isLine} onClick={() => setIsLine(!isLine)} />
                    </div>
                    <div className={styles['chart-body']}>
                        {
                            isLine
                                ? (
                                    <LineChart data={newFans} />
                                )
                                : (
                                    <HistorgamChart data={newFans} />
                                )
                        }
                    </div>
                </div>
            </div>
            <div className={styles['class-wrapper']}>
                <div className={styles['header']}>粉丝组成</div>
                <div className={styles['chart-body']}>
                    <RoseChart data={gender} />
                </div>
            </div>
        </div>
    );
};

export default FansData;