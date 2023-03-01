import React, { ReactEventHandler, useEffect, useRef, useState } from "react";
import { Col, Input, Row, Button } from "antd";
import styles from './index.module.less';
interface Data {
    index: number,
    imageData: ImageData
}
interface FCprops {
    drawImage: (data:ImageData) => void,
    imageDataArr:ImageData[],
    setImageDataArr:(d:ImageData[]) => void,
    cur:number
}
const WaterMark: React.FC<FCprops> = ({ drawImage, setImageDataArr,cur, imageDataArr}) => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const initData = ctx.getImageData(0,0,canvas.width,canvas.height);    
    const [position, setPosition] = useState({ x: canvas.width / 2, y: canvas.height / 2 });

    const [value, setValue] = useState("");
    const changeWaterMarkPosition = (x: number, y: number) => {
        setPosition({
            x, y
        });
    }
    useEffect(() =>{
        markText();
    },[position])
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        setValue(text);

    }
    const markText = () => {
        if(!value) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawImage(initData);
        ctx.font = "18px 宋体"
        ctx.fillStyle = "##cfcfcf"
        ctx.textAlign = "left";
        if (position.x > canvas.width / 2) {
            ctx.textAlign = 'right'
        }
        else if (position.x == canvas.width / 2) {
            ctx.textAlign = 'center';
        }

        ctx.fillText(value, position.x, position.y);
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height) as ImageData;
        imageDataArr[cur] = imageData;
        setImageDataArr([...imageDataArr]);
    }

    const getActivedStyle = (x: number, y: number) => {
        if (position.x == x && position.y == y) return styles['actived'];
        return ""
    }
    return (
        <div className={styles['watermark-wrapper']}>
            <Row><span className={styles['tag']}>内容</span></Row>
            <Row>
                <Col span={20}>
                    <Input placeholder="请输入水印" max={4} value={value} onChange={handleChange} />
                </Col>
                <Col span={1}>
                    <Button
                        style={{ backgroundColor: "#ff2442", color: "#fff" }}
                        onClick={markText}
                    >打水印</Button>
                </Col>
            </Row>
            <Row><span className={styles['tag']}>位置</span></Row>
            <Row>
                <div className={styles['box']}>
                    <div className={styles['tow']}>
                        <span
                            className={getActivedStyle(0, 20)}
                            onClick={() => changeWaterMarkPosition(0, 20)}>左上</span>
                        <span
                            className={getActivedStyle(canvas.width, 20)}
                            onClick={() => changeWaterMarkPosition(canvas.width, 20)}>右上</span>
                    </div>
                    <div className={styles['one']}>
                        <span
                            className={getActivedStyle(canvas.width / 2, canvas.height / 2)}
                            onClick={() => changeWaterMarkPosition(canvas.width / 2, canvas.height / 2)}>中间</span>
                    </div>
                    <div className={styles['tow']}>
                        <span
                            className={getActivedStyle(0, canvas.height - 20)}
                            onClick={() => changeWaterMarkPosition(0, canvas.height - 20)}>左下</span>
                        <span
                            className={getActivedStyle(canvas.width, canvas.height - 20)}
                            onClick={() => changeWaterMarkPosition(canvas.width, canvas.height - 20)}>右下</span>
                    </div>
                </div>
            </Row>
        </div>
    );
};

export default WaterMark;