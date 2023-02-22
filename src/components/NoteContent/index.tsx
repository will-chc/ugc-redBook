import React, { useState } from "react";
import styles from './index.module.less';
import {LeftCircleOutlined, RightCircleOutlined} from "@ant-design/icons";
const NoteContent: React.FC = ({ data }) => {
    const arr = [
        "https://sns-img-hw.xhscdn.com/fc53deac-8d48-f4ee-feb1-c8316f3723d3?imageView2/2/h/1200/format/webp",
        "https://sns-img-hw.xhscdn.com/e515fd79-d196-4fda-60d1-f7a8f6180506?imageView2/2/w/1200/format/webp"
    ]
    const [cur, setCur] = useState(1);
    const [isShow, setIsShow] = useState(false);
    const preImg = () => {
        if(cur === 0) {
            setCur(arr.length-1);
        }
        else {
            setCur(cur - 1);
        }
        
    }
    const nextImg = () => {
        if(cur === arr.length-1) {
            setCur(0);
        }
        else {
            setCur(cur + 1);
        }
    }
    const showOption = () => {
        if(arr.length === 1) {
            return ;
        }
        setIsShow(true);
    }
    const hiddenOption = ()=> {
        if(!isShow){
            return ;
        }
        setIsShow(false);
    }
    return (
        <>
            <div className={styles['media-wrapper']} onMouseOver={showOption} onMouseOut={hiddenOption}>
                <img src={arr[cur]} />
                {isShow ? (
                    <>
                        <span className={styles['img-count']}>{cur + 1}/{arr.length}</span>
                        <LeftCircleOutlined  className={styles['left_']} onClick={preImg}/>
                        <RightCircleOutlined  className={styles['right_']} onClick={nextImg}/>
                    </>
                ) : null}
            </div>
            <div>
                1111
            </div>
        </>
    );
};

export default NoteContent;