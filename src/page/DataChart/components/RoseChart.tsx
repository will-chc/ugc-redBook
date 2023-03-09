import React, { useEffect, useRef } from "react";
import * as echarts from 'echarts';

interface FCprops {
    data: any[]
}
const RoseChart: React.FC<FCprops> = ({ data }) => {
    const fansData = [
        { count: 28, label: '男' },
        { count: 19, label: '女' },
        { count: 31, label: '不展示' },
    ]
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
                data: fansData.map(d=>({
                    name:d.label,
                    value:d.count
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

    return (
        <div id='roseChart' ref={chartRef} style={{width:200, height:300}}></div>
    );
};

export default RoseChart;