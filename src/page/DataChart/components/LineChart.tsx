import React, { useEffect, useRef, useState } from "react";
import { Chart } from '@antv/g2';
interface FCprops {
    data: any[]
}
const LineChart: React.FC<FCprops> = ({ data }) => {

    const chartRef = useRef<any>(undefined);
    useEffect(() => {
        if (!chartRef.current) {
            creatChart();
        }
    }, []);



    const creatChart = () => {
        // 创建chart
        const chart = new Chart({
            container: 'line',
            width:510,
            height:300
        });
        chartRef.current = chart;
        // 关联数据
        chart.data(data);

        //
        chart.scale({
            //x轴
            year: {
                range: [0, 1]// 刻度间距
            },
            //y
            value: {
                min: 0,
                nice: true//自动配置合适的刻度值
            }
        });
        // 绘制折线
        chart.line().position("year*value");
        // 绘制点
        chart.point().position('year*value').size(4).shape('circle').style({
            stroke: '#fff', //边框
            lineWidth: 1
        });

        //渲染
        chart.render();
    }
    return (
        <div id="line"></div>
    );
};

export default LineChart;