import React, { useEffect, useRef } from "react";
import { Chart } from "@antv/g2";
interface FCprops {
    data:any[]
}
const HistorgamChart:React.FC<FCprops> = ({data}) => {
    
    const chartRef = useRef<any>(undefined);

    useEffect(()=>{
        if(!chartRef.current){
            createChart();
        }
    },[]);

    const createChart = () => {
        const chart = new Chart({
            container:'historgam',
            width:510,
            height:300
        });
        chartRef.current = chart;

        chart.data(data);
        chart.scale('sales', {
          tickInterval: 20
        });
        chart.interval().position('year*value');
        chart.render();
    }
    return (
        <div id="historgam">

        </div>
    );
};

export default HistorgamChart;