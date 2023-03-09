import React, { useEffect, useRef, useState } from "react";
import styles from './index.module.less'
import * as echarts from 'echarts';
interface key {
    [key: string]: string;
    views: string;
    likes: string;
    comments: string;
  }
const KEYMAP: key = {
    views:'浏览量',
    likes:'点赞数',
    comments:'评论数'
}
const NoteData: React.FC = () => {
    const cardArr = [
        {
            label: '浏览量',
            value: 18809,
            key:'views'
        },
        {
            label: '点赞数',
            value: 18,
            key:'likes'
        },
        {
            label: '评论数',
            value: 12,
            key:'comments'
        }
    ];
    const getData = () => {
        if(activedKey == 'views')
        return [10086, 998, 1212, 111, 508, 991];
        return [5, 20, 36, 10, 10, 20, 5];
    }

    const [activedKey, setActivedKey] = useState(cardArr[0].key);
    const getStyles = (key:string) => {
        let className = styles['card']
        if (key == activedKey) return className + " " + styles['actived'];
        return className;
    }
    return (
        <div className={styles['wrapper']}>
            <div className={styles['header']}>
                数据概览
            </div>
            <div className={styles['card-list']}>
                {
                    cardArr.map((card, i) => (
                        <div className={getStyles(card.key)} key={card.key} onClick={() => setActivedKey(card.key)}>
                            <div className={styles['item']}>{card.label}</div>
                            <div className={styles['value']}>{card.value}</div>
                        </div>
                    ))
                }


            </div>
            <div className={styles['chart']}>
                <header className={styles['header']}>近七天 {KEYMAP[activedKey]}</header>
                <Chart data={getData()} label ={KEYMAP[activedKey]}/>
            </div>
        </div>
    );
};

interface chartFC {
    data:number[],
    label:string
}
const Chart:React.FC<chartFC>= ({data, label}) => {
    const chartRef = useRef<any>(null);
    const option = {
        title: {
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: [label],
        },
        xAxis: {
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        },
        yAxis: {},
        series: [
          {
            name: label,
            type: "line",
            data
          },
        ],
      };
    useEffect(()=>{
        const chart =  echarts.init(chartRef.current);
        chart.setOption(option);
    },[data,label]);
    return (
        <div ref={chartRef} style={{width:800, height:400}}></div>
    )
}

export default NoteData;