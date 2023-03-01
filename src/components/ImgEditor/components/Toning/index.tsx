import React, { useEffect, useRef, useState } from "react";
import { Slider, InputNumber, Row, Col,Button } from "antd";
import styles from './index.module.less';
interface FCprops  {
    imgRgbArr:{R:number, G:number, B:number}[],
    cur:number,
    setImgRgbArr:(imgRgbArr:any) => void;
    imageDataArr:ImageData[],
    setImageDataArr:(d:ImageData[]) => void,
}
const Toning: React.FC<FCprops> = ({imgRgbArr, cur, setImgRgbArr,imageDataArr,setImageDataArr}) => {

    const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d') as CanvasRenderingContext2D;
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const rgbString = ['R', 'G', "B"]
    const [R, setR] = useState<number>(imgRgbArr[cur].R);
    const [G, setG] = useState<number>(imgRgbArr[cur].G);
    const [B, setB] = useState<number>(imgRgbArr[cur].B);
    const RGB = [{ value: R, setValue: setR }, { value: G, setValue: setG }, { value: B, setValue: setB }];
    const marks = {
       0:"0"
      };
    const onChange = (newValue: number, setValue: (value: number) => void) => {
        setValue(newValue);
    };

    const initImageData  = useRef(imageData);
    
    useEffect(()=> {
        const init = initImageData.current.data;
        
        for (var index = 0; index < length; index += 4) {
            init[index]  -= R!;
            init[index + 1]  -= G!;
            init[index + 2]  -= B!;
            //这里可以对 r g b 进行计算（这里的rgb是每个像素块的rgb颜色）
        }

    },[])
    useEffect(() => {
        handleToning();
    }, [R, G, B]);
    const handleToning = () => {
        var length = imageData.data.length;
        const init = initImageData.current.data;
        
        for (var index = 0; index < length; index += 4) {
            imageData.data[index] = init[index] *( R!*0.01 + 1);
            imageData.data[index + 1] = init[index + 1] *( G!*0.01 + 1);
            imageData.data[index + 2] = init[index + 2] *( B!*0.01 + 1);
            //这里可以对 r g b 进行计算（这里的rgb是每个像素块的rgb颜色）
        }
        // 更新新数据
        ctx.putImageData(imageData, 0, 0);
        imgRgbArr[cur] = {R,G,B};
        setImgRgbArr(imgRgbArr);
        imageDataArr[cur] = imageData;
        setImageDataArr([...imageDataArr]);

    }
    return (
        <div className={styles['tonging-wrapper']}>
            {RGB.map((item, i) => {
                return <div key={i}>
                    <Row>{rgbString[i]} ：</Row>
                    <Row>
                        <Col span={20}>
                            <Slider
                                min={-100}
                                max={100}
                                marks={marks}
                                onChange={v => onChange(v, item.setValue)}
                                value={typeof item.value === 'number' ? item.value : 0}
                            />
                        </Col>
                        <Col span={4}>
                            <InputNumber
                                controls={false}
                                min={-100}
                                max={100}
                                style={{ margin: '0 16px', width: 50 }}
                                value={item.value}
                                onChange={v => onChange(v as number, item.setValue)}
                            />
                        </Col>
                    </Row>
                </div>
            })}
        </div>
    );
};

export default Toning;