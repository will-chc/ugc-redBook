import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from './index.module.less'
import * as echarts from 'echarts';
import request from "../../../../server/request";
interface key {
    [key: string]: string;
    views: string;
    likes: string;
    comments: string;
}
const KEYMAP: key = {
    views: '浏览量',
    likes: '点赞数',
    comments: '评论数'
}
const NoteData: React.FC<{likeTotal:number}> = ({likeTotal}) => {
    const user_id = localStorage.getItem('userId');
    
    const [cardArr, setCardArr] = useState([
        {
            label: '浏览量',
            value: 0,
            key: 'views'
        },
        {
            label: '点赞数',
            value: 0,
            key: 'likes'
        },
        {
            label: '评论数',
            value: 0,
            key: 'comments'
        }
    ]);
    const [data, setData] = useState<any[]>([]);
  
    const getData = async () => {
        let data: {
            name: string,
            value: number
        }[] = [];
        if (activedKey == 'views') {
           
        }
        switch (activedKey) {
            case 'views':
                const { viewsList } = await request('/note_views_7', { user_id }) as any;
                data = viewsList.map((v: any) => ({ name: v.title, value: v.views }));
                break;
                
            case 'likes': 
            const { likeArr } = await request('/like_7', {user_id}) as any;
            data = likeArr.map((l:any)=>({
                name:l.title,
                value:l.count
            }));
            break;

            case 'comments':
                const { comments } = await request('/comments_7', {user_id}) as any;
                data = comments.map((l:any)=>({
                    name:l.title,
                    value:l.count
                }));
                break;
        }
        setData(data);
        
    }

    useEffect(() => {
        request('/note_data_view', { user_id }).then((res: any) => {
            const { viewTotal, commentTotal } = res;
            cardArr[0].value = viewTotal;
            cardArr[1].value = likeTotal;
            cardArr[2].value = commentTotal;
            setCardArr([...cardArr]);
        });
    }, [likeTotal])
    const [activedKey, setActivedKey] = useState(cardArr[0].key);
    useLayoutEffect(() => {
        getData();
    }, [activedKey]);



    const getStyles = (key: string) => {
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
                <header className={styles['header']}>{activedKey === 'views' ? "最近七篇" : "近七天"} {KEYMAP[activedKey]}</header>
                <Chart data={data} label={KEYMAP[activedKey]} />
            </div>
        </div>
    );
};

interface chartFC {
    data: {
        value: number,
        name: string
    }[],
    label: string
}
const Chart: React.FC<chartFC> = ({ data, label }) => {
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
            data: data.map(d => d.name),
        },
        axisLabel: {
            showMinLabel: true,
            showMaxLabel: true,
            formatter: function (value: string) {
                if (value.length > 5) {
                    return value.substring(0, 5) + '...';
                } else {
                    return value;
                }
            }
        },
        yAxis: {},
        series: [
            {
                name: label,
                type: "line",
                data,
                lineStyle: {
                    color: '#ff4684',
                    width: 4,
                },
                symbol: 'circle',
                symbolSize: 10,// 设置点的大小为10
                itemStyle: {
                    color: '#fff', // 设置点的颜色为红色
                    borderWidth: 2, // 设置点的边框宽度为2
                    borderColor: '#ff4684', // 设置点的边框颜色为黄色
                }
            },
        ],
    };
    useEffect(() => {
        // console.log(111);
        const chart = echarts.init(chartRef.current);
        chart.setOption(option);
        return () => {
            chart.dispose();
        }
    }, [data, label]);
    return (
        <div ref={chartRef} style={{ width: 800, height: 400 }}></div>
    )
}

export default NoteData;