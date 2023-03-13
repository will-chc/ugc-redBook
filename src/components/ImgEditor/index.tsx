import React, { useEffect, useRef, useState } from "react";
import styles from './index.module.less';
import { Button } from 'antd'
import axios from 'axios';
import { dataURLToFile } from "../../utils/dataFormat";
import Toning from "./components/Toning";
import WaterMark from "./components/WaterMark";
interface FCprops {
    imgArr: string[],
    setImgArr: (arr: string[]) => void,
    setIsImgEditorOpen: (open: boolean) => void;
}
const ImgEditor: React.FC<FCprops> = ({ imgArr, setImgArr, setIsImgEditorOpen }) => {

    // 数组下标
    const [curImg, setCurImg] = useState(0);

    const [option, setOption] = useState('cut');

    const [cutRate, setCutRate] = useState(3 / 4);

    const [width, setWidth] = useState<number | undefined>(100);
    const [height, setHeight] = useState<number | undefined>(100);

    const [moveStyle, setMoveStyle] = useState({ left: 0, top: 0 });

    const [imgRgbArr, setImgRgbArr] = useState(new Array(imgArr.length).fill({ R: 0, G: 0, B: 0 }));

    const [cutReat, setCutReat] = useState({
        width: 0,
        height: 0
    });

    // 图片左、上边界 与容器左上的距离
    const [instance, setInstance] = useState({
        left: 0,
        top: 0
    });

    // 修改后的图片数据
    const [imageDataArr, setImageDataArr] = useState<ImageData[]>(new Array(imgArr.length).fill(undefined));

    //Ref
    const isMouseDown = useRef(false);

    const position = useRef({
        x: 0,
        y: 0
    });

    const move = useRef({
        x: 0,
        y: 0
    });

    const moveArea = useRef({
        x: {
            left: 0,
            right: 0
        },
        y: {
            top: 0,
            bottom: 0
        }
    });

    //canvas 
    const imgCanvas = useRef<HTMLCanvasElement | null>(null);


    // function
    useEffect(() => {
    }, [imageDataArr])
    useEffect(() => {
        if (option == 'cut') handleCanvas();
    }, [cutRate, option]);

    useEffect(() => {
        let img = document.getElementById('img') as HTMLImageElement;
        img.onload = () => {

            const aspectratio = img.naturalWidth / img.naturalHeight;
            const wrapperAspectratio = 597 / 332;

            if (aspectratio >= wrapperAspectratio) {

                setWidth(597);
                setHeight(undefined);

            }
            else {
                setWidth(undefined)
                setHeight(332);
            }
            if (option == 'cut') handleCanvas();
            drawImage();
        }
        if (option == 'cut') handleCanvas();
        drawImage();
    }, [curImg, width]);


    const handleCanvas = () => {

        let img = document.getElementById('img') as HTMLImageElement;
        // 外层容器
        let wrapper = document.getElementById('wrapper') as HTMLDivElement;
        // 外层容器的width 和height
        let wrapperReat = wrapper.getBoundingClientRect();

        // canvas 
        // let canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
        let mask: HTMLCanvasElement = document.getElementById('mask') as HTMLCanvasElement;
        let cutCanvas: HTMLCanvasElement = document.getElementById('cutReat') as HTMLCanvasElement;
        // let ctx = canvas?.getContext('2d') as CanvasRenderingContext2D;
        let maskCtx = mask?.getContext('2d') as CanvasRenderingContext2D;
        let cutCanvasCtx = cutCanvas?.getContext('2d') as CanvasRenderingContext2D;

        // 跨域
        img.crossOrigin = 'anonymous';

        // 绘制图片
        // canvas.height = img.height;
        // canvas.width = img.width;

        //遮罩
        mask.width = img.width;
        mask.height = img.height;

        // 裁剪框大小
        let cutReat = {
            width: 150,
            height: 200
        }

        // 计算裁剪框大小
        let width = mask.height * cutRate;
        let height = mask.width / cutRate;
        cutReat.width = (width > mask.width) ? mask.width : width;
        cutReat.height = (height > mask.height) ? mask.height : height;

        setCutReat(cutReat);

        cutCanvas.width = cutReat.width;
        cutCanvas.height = cutReat.height;

        // 裁剪框的初始位置
        const position = {
            x: (cutReat.width == mask.width) ? 0 : (mask.width - cutReat.width) / 2,
            y: (cutReat.height == mask.height) ? 0 : (mask.height - cutReat.height) / 2
        }
        // 被裁图片绘制
        // ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        // 裁剪框绘制
        cutCanvasCtx.strokeStyle = "lightgreen";
        cutCanvasCtx.lineWidth = 6
        cutCanvasCtx?.strokeRect(0, 0, cutReat.width, cutReat.height);

        //遮罩绘制
        maskCtx.fillStyle = "rgba(0,0,0,.8)"
        maskCtx?.fillRect(0, 0, mask.width, mask.height);
        maskCtx?.clearRect(position.x, position.y, cutReat.width, cutReat.height);


        // 图片边界到容器边界的距离
        setInstance({
            left: (wrapperReat.width - img.width) / 2,
            top: (wrapperReat.height - img.height) / 2
        })

        move.current.x = (wrapperReat.width - img.width) / 2 + position.x;
        move.current.y = (wrapperReat.height - img.height) / 2 + position.y;

        setMoveStyle({
            left: move.current.x,
            top: move.current.y
        });

        moveArea.current.x = {
            left: move.current.x - position.x,
            right: move.current.x + position.x
        };
        moveArea.current.y = {
            top: move.current.y - position.y,
            bottom: move.current.y + position.y
        };
        // setImgPosition({
        //     x: (wrapperReat.width - img.width) / 2 + position.x,
        //     y: (wrapperReat.height - img.height) / 2 + position.y
        // });

        // initPosition.current.x = move.current.x;
        // initPosition.current.y = move.current.y;

        // 裁剪框可移动范围
        // moveArea.current.x = {
        //     left: initPosition.current.x - position.x,
        //     right: initPosition.current.x + position.x
        // };
        // moveArea.current.y = {
        //     top: initPosition.current.y - position.y,
        //     bottom: initPosition.current.y + position.y
        // };
    }

    // 移动裁剪框相关
    const handleMouseDown = (event: React.MouseEvent) => {
        isMouseDown.current = true;
        position.current.x = event.clientX
        position.current.y = event.clientY
    };
    const handleMouseMove = (event: React.MouseEvent) => {

        if (isMouseDown.current) {
            const deltaX = event.clientX - position.current.x;
            const deltaY = event.clientY - position.current.y;

            const newStyle = {
                left: deltaX + move.current.x,
                top: deltaY + move.current.y
            };

            newStyle.left = (newStyle.left < moveArea.current.x.left) ? moveArea.current.x.left : newStyle.left;
            newStyle.left = (newStyle.left > moveArea.current.x.right) ? moveArea.current.x.right : newStyle.left;
            newStyle.top = (newStyle.top < moveArea.current.y.top) ? moveArea.current.y.top : newStyle.top;
            newStyle.top = (newStyle.top > moveArea.current.y.bottom) ? moveArea.current.y.bottom : newStyle.top;

            setMoveStyle(newStyle);
            updateReat();
        }
    };
    const handleMouseUp = (event: React.MouseEvent) => {
        isMouseDown.current = false;
        move.current.x = moveStyle.left;
        move.current.y = moveStyle.top;
    }

    const updateReat = () => {
        let mask: HTMLCanvasElement = document.getElementById('mask') as HTMLCanvasElement;
        let maskCtx = mask.getContext('2d');
        maskCtx?.clearRect(0, 0, mask.width, mask.height);

        maskCtx?.fillRect(0, 0, mask.width, mask.height);
        maskCtx?.clearRect(moveStyle.left - instance.left, moveStyle.top - instance.top, cutReat.width, cutReat.height);
    }

    const handleCut = () => {
        // 外层容器
        let wrapper = document.getElementById('wrapper') as HTMLDivElement;
        // 外层容器的width 和height
        let wrapperReat = wrapper.getBoundingClientRect();

        let canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
        let ctx = canvas.getContext('2d');

        let cutCanvas: HTMLCanvasElement = document.getElementById('cutReat') as HTMLCanvasElement;
        let cutCanvasCtx = cutCanvas.getContext('2d');

        let img = document.getElementById('img') as HTMLImageElement;

        // 裁剪位置
        const cutPosition = {
            // x:moveStyle.left - (wrapperReat.width - img.width)/2,
            x: moveStyle.left - instance.left,
            // y:moveStyle.top - (wrapperReat.height - img.height)/2
            y: moveStyle.top - instance.top
        }
        const imgData = ctx?.getImageData(cutPosition.x, cutPosition.y, cutReat.width, cutReat.height) as ImageData;
        cutCanvasCtx?.putImageData(imgData, 0, 0);
        const dataURL = cutCanvas.toDataURL();
        cutCanvasCtx?.clearRect(0, 0, cutCanvas.width, cutCanvas.height);
        cutCanvasCtx?.strokeRect(0, 0, cutCanvas.width, cutCanvas.height);


        upLoadImage(dataURL);
        // const filename = Math.random().toString(36).substring(2, 10) + '.jpg';
        // const file = dataURLToFile(dataURL, filename);
        // const params = new FormData();
        // params.append("file", file);

        // axios({
        //     method: 'POST',
        //     url: 'http://localhost:5000/uploadImg',
        //     data: params
        // }).then((res) => {
        //     const { src } = res.data;
        //     imgArr[curImg] = src;
        //     setImgArr([...imgArr]);
        // });
    }


    //drawImage
    const drawImage = (data?:ImageData) => {
        const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
        const ctx = canvas?.getContext('2d') as CanvasRenderingContext2D;
        const img = document.getElementById('img') as HTMLImageElement;
        // 跨域
        imgCanvas.current = canvas;
        img.crossOrigin = 'anonymous';
        // 被裁图片绘制
        canvas.height = img.height;
        canvas.width = img.width;
        if(data) {
            ctx.putImageData(data, 0, 0);
        }
        else{
            ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
    }

    const switchOptions = (option: string) => {
        setOption(option);
    }

    const handleOk = () => {
        // 关闭模态框
        // setIsImgEditorOpen(false);
        //上传
        const up = document.getElementById('uploadCanvas') as HTMLCanvasElement;
        const upCtx = up.getContext('2d') as CanvasRenderingContext2D;
        imageDataArr.forEach((data) => {
            if (data) {         
                up.width = data.width;
                up.height = data.height;
                upCtx.putImageData(data,0,0);
                const dataURL = up.toDataURL();
                upLoadImage(dataURL);
            }
        });
         // 关闭模态框
        setIsImgEditorOpen(false);
    }

    const upLoadImage = (dataURL:string) => {
        const filename = Math.random().toString(36).substring(2, 10) + '.jpg';
        const file = dataURLToFile(dataURL, filename);
        const params = new FormData();
        params.append("file", file);

        axios({
            method: 'POST',
            url: 'http://localhost:5000/uploadImg',
            data: params
        }).then((res) => {
            const { src } = res.data;
            imgArr[curImg] = src;
            setImgArr([...imgArr]);
        });
    }



    return (
        <div className={styles['wrapper']}>
            <div className={styles['content']}>
                <div className={styles['pre-view']} id="wrapper">
                    <canvas className={styles['canvas']} id='uploadCanvas'></canvas>
                    <img src={imgArr[curImg]} id='img' width={width} height={height} />
                    <canvas className={styles['canvas']} id='canvas' ></canvas>
                    {option === 'cut'
                        ? (
                            <>
                                <canvas className={styles['canvas']} id='mask' ></canvas>
                                <canvas className={styles['canvas']}
                                    style={{ cursor: "move", ...moveStyle }}
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    id='cutReat'></canvas>
                            </>
                        )
                        : null}
                </div>
                <div className={styles['options-wrapper']}>
                    <div className={styles['options-bar']}>
                        <span
                            className={(option == "cut" ? styles['actived'] : "")}
                            onClick={() => switchOptions('cut')}>比例</span>
                        <span
                            className={(option == "toning" ? styles['actived'] : "")}
                            onClick={() => switchOptions('toning')}>调色</span>
                        <span
                            className={(option == "watermark" ? styles['actived'] : "")}
                            onClick={() => switchOptions('watermark')}>水印</span>
                    </div>
                    <div className={styles['options-body']}>
                        {option == 'cut'
                            ? (
                                <div className={styles['cut-wrapper']}>
                                    <div className={styles['long-box'] + " " + (cutRate == 3 / 4 ? styles['actived'] : "")} onClick={() => setCutRate(3 / 4)}>3:4</div>
                                    <div className={styles['wide-box'] + " " + (cutRate == 4 / 3 ? styles['actived'] : "")} onClick={() => setCutRate(4 / 3)}>4:3</div>
                                    <Button onClick={handleCut}>裁剪</Button>
                                </div>
                            ) : null}
                        {
                            option == 'toning'
                                ? (
                                    <Toning imgRgbArr={imgRgbArr} cur={curImg} setImgRgbArr={setImgRgbArr} imageDataArr={imageDataArr} setImageDataArr={setImageDataArr} />
                                )
                                : null
                        }
                        {
                            option == 'watermark'
                                ? (
                                    <div className={styles['watermark-wrapper']}>
                                        <WaterMark drawImage={drawImage} imageDataArr={imageDataArr} setImageDataArr={setImageDataArr} cur={curImg} />
                                    </div>
                                )
                                : null
                        }
                    </div>
                </div>
            </div>
            <div className={styles["footer"]}>
                <div className={styles["img-bar"]}>
                    {
                        imgArr.map((src, index) => {
                            return <div key={Math.random()} className={styles['thumbnail']} onClick={() => setCurImg(index)}>
                                <img src={src} />
                            </div>
                        })
                    }
                </div>
                <div className={styles["btn"]}>
                    <Button onClick={() => setIsImgEditorOpen(false)}>取消</Button>
                    <Button onClick={handleOk}>确认</Button>
                </div>
            </div>
        </div>
    );
};

export default ImgEditor;