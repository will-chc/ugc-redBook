import React from "react";
import styles from './index.module.less';
import { Row, Col } from "antd";
import { emojiArr } from "./emoji";

interface FCprops {
    openChang: (open:boolean) => void;
    emojiInput: (emoji:string) => void;
}
const EmojiInput: React.FC <FCprops>= ( {openChang, emojiInput}) => {
    const handleClick = (emoji:string) => {
        openChang(false);
        emojiInput(emoji);
    }
    return (
        <div className={styles['emoji-wrapper']}>
            <Row gutter={[12,12]}>
                {emojiArr.map((emoji) => <Col className={styles['emoji-item']} onClick={()=>handleClick(emoji)}>{emoji}</Col>)}
            </Row>
        </div>
    );
};
export default EmojiInput;