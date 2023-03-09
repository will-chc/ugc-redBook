import React, { useState } from "react";
import { Select, Switch } from "antd";
import styles from './index.module.less';
import RoseChart from "../RoseChart";
import LineChart from "../LineChart";
import HistorgamChart from "../HistorgamChart";
const FansData: React.FC = () => {
    const [isLine, setIsLine] = useState(true);

    const data = [
        { year: '2010', value: 10 },
        { year: '2011', value: 30 },
        { year: '2012', value: 50 },
        { year: '2013', value: 20 },
        { year: '2014', value: 60 },
        { year: '2015', value: 40 },
        { year: '2016', value: 80 },
        { year: '2017', value: 70 },
        { year: '2018', value: 90 },
        { year: '2019', value: 110 },
        { year: '2020', value: 100 },
    ];


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
    const [activedOption, setActivedOption] = useState(selectOption[0]);
    return (
        <div className={styles['wrapper']}>
            {/* <div className={styles['tab']}>
                <Select
                    defaultValue={selectOption[0].value}
                    style={{ width: 120 }}
                    options={selectOption}
                    onChange={(v, option: any) => setActivedOption(option)}
                />
            </div> */}
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
                                    <LineChart data={data} />
                                )
                                : (
                                    <HistorgamChart data={data} />
                                )
                        }
                    </div>
                </div>
            </div>
            <div className={styles['class-wrapper']}>
                <div className={styles['header']}>粉丝组成</div>
                <div className={styles['chart-body']}>
                    <RoseChart data={data} />
                </div>
            </div>
        </div>
    );
};

export default FansData;