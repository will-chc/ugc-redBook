import React, { useEffect, useRef } from "react";
import * as echarts from 'echarts';

interface FCprops {
    data: any[]
}
const RoseChart: React.FC<FCprops> = ({ data }) => {
    const fansData = [
        { count: 28, gender: '男' },
        { count: 19, gender: '女' },
        { count: 31, gender: '不展示' },
    ];
    console.log(data);

    const chartRef = useRef<any>(null);
    const options = {
        tooltip: {},
        legend: {
        },
        series: [
            {
                name: '粉丝数',
                type: 'pie',
                radius: [10, 100],
                roseType: 'radius',
                label: {
                    show: false,
                },
                emphasis: {
                    label: {
                        show: true,
                    },
                },
                data: data.map(d => ({
                    name: d.gender,
                    value: d.count
                })),
            }
        ]
    }
    useEffect(() => {
        const chart = echarts.init(chartRef.current);
        chart.setOption(options);
        return () => {
            chart.dispose();
        }
    }, []);
    useEffect(() => {
        const chart = echarts.init(chartRef.current);
        
        if (chart) {
            chart.setOption({
                series: [
                    {
                        data: data.map((d) => ({
                            name: d.gender,
                            value: d.count,
                        })),
                    },
                ],
                notMerge: false, // 设置为 false 表示合并数据而不是覆盖
            });
        }
        
    }, [data, chartRef.current]);



    return (
        <div id='roseChart' ref={chartRef} style={{ width: 200, height: 300 }}></div>
    );
};

export default RoseChart;