import React, { ReactEventHandler, useContext, useEffect, useState } from "react";
import styles from './index.module.less';
import { LeftCircleOutlined, RightCircleOutlined } from "@ant-design/icons";
// import { createFromIconfontCN } from "@ant-design/icons";
import { NoteContext } from "../../Context";
import { Button, Popover } from "antd";
import EmojiInput from "../EmojiInput";
import { MyIcon } from "../../Icon/MyIcon";

interface propsIF {
    data: object
}
const NoteContent: React.FC<propsIF> = ({ data }) => {
    const contextValue = useContext(NoteContext);
    const { user: userInfo } = contextValue.note_card;
    useEffect(() => {
        console.log(contextValue, "@@");

    }, [contextValue])

    // icon
    // const MyIcon = createFromIconfontCN({
    //     scriptUrl: 'src/Icon/aliicon.js', // 在 iconfont.cn 上生成
    // });
    // 测试数据
    const arr = [
        "https://sns-img-hw.xhscdn.com/fc53deac-8d48-f4ee-feb1-c8316f3723d3?imageView2/2/h/1200/format/webp",
        "https://sns-img-hw.xhscdn.com/e515fd79-d196-4fda-60d1-f7a8f6180506?imageView2/2/w/1200/format/webp"
    ];
    const content = `至于为啥有小米12s，而没有小米13s，那是因为小米12s是出来救场的。
小米12当初销量不给力，又赶上骁龙8Gen1，然后小米12s系列出来后，换了骁龙8+处理器，又升级了一下后置主摄。
    现在小米13之所以没有小米13s，一是因为小米13的销量还不错，又人预估200万了，估计差不多，二是因为处理器也够用了。
    即使小米13要卖两年，出13s，也得是明年了。
    想买小米13的可以继续买，想等促销的，可以等到3月底的米粉节，感觉至少也能降300。`;
    const title = '雷军确认，没有小米13s，继续买小米13吧！';
    const tag = '#小米13#小米手机#小米#数码#数码街区由我造#一起聊数码#手机';
    const comments = "即使小米13要卖两年，出13s，也得是明年了";
    let likeCount = 66;
    const list = new Array(6).fill(1);
    let inputRef:HTMLInputElement | null;

    // state
    const [cur, setCur] = useState(1);
    const [liked, setLiked] = useState(false);
    const [isShow, setIsShow] = useState(false);
    const [placeholder, setPholder] = useState<string | undefined>('请留下有爱的评论吧！');
    const [isEmojiShow, setIsEmojiShow] = useState(false);
    const [comments_, setComments_] = useState<string | number | readonly string[] | undefined>("");
    const [hasInput, setHasInput] = useState<string | undefined>("");
    // function 
    const preImg = () => {
        if (cur === 0) {
            setCur(arr.length - 1);
        }
        else {
            setCur(cur - 1);
        }

    }
    const nextImg = () => {
        if (cur === arr.length - 1) {
            setCur(0);
        }
        else {
            setCur(cur + 1);
        }
    }
    const showOption = () => {
        if (arr.length === 1) {
            return;
        }
        setIsShow(true);
    }
    const hiddenOption = () => {
        if (!isShow) {
            return;
        }
        setIsShow(false);
    }
    const likeOption = () => {
        setLiked(!liked);
    }

    const handleOpenEmojiChange = (open: boolean) => {
        setIsEmojiShow(open);
    }

    const handleInput = ( e: React.ChangeEvent<HTMLInputElement>) => {
        setComments_(e.target.value);
        if(e.target.value) {
            setHasInput(styles['hasInput']);
        }
        else {
            setHasInput("");
        }
             
    }
    const emojiInput = (emoji:string) => {
        if(comments_){
            setComments_(comments_ + emoji);
        }
        else {
            setComments_(emoji);
        }
        setHasInput(styles['hasInput']);
    } 

    return (
        <>
            <div className={styles['media-wrapper']} onMouseOver={showOption} onMouseOut={hiddenOption}>
                <img src={arr[cur]} />
                {isShow ? (
                    <>
                        <span className={styles['img-count']}>{cur + 1}/{arr.length}</span>
                        <LeftCircleOutlined className={styles['left_']} onClick={preImg} />
                        <RightCircleOutlined className={styles['right_']} onClick={nextImg} />
                    </>
                ) : null}
            </div>
            <div className={styles['interaction-container']}>
                <div className={styles['header']}>
                    <div className={styles['info']}>
                        <img className={styles['avatar']} src='https://sns-avatar-qc.xhscdn.com/avatar/5fe0081033f23588f454408a.jpg' />
                        <span className={styles['name']}>{userInfo.nick_name}</span>
                    </div>
                    <div className={styles['follow-option']}>关注</div>
                </div>
                <div className={styles['note-scroll']}>
                    <div className={styles['content']}>
                        <div className={styles['title']}>{title}</div>
                        <div className={styles['desc'] + " " + styles['p-spacing']}>
                            {content}

                        </div>
                        <div className={styles['desc']}>{tag}</div>
                        <div className={styles['date']}>2023-2-22 10:00:00</div>
                    </div>
                    <div className={styles['comments-container']}>
                        <div className={styles['total']}>共{list.length}条评论</div>
                        <div className={styles['list-container']}>
                            {list.map((list_item) => {
                                return (
                                    <div className={styles['comments-item']}>
                                        <div className={styles['avatar']}>
                                            <img src="https://sns-avatar-qc.xhscdn.com/avatar/5fe0081033f23588f454408a.jpg" alt="" width={32} height={32} />
                                        </div>
                                        <div className={styles['comments-body']}>
                                            <div className={styles['name-wrapper']}>
                                                <span className={styles['name']}>{userInfo.nick_name}</span>
                                            </div>
                                            <div className={styles['content']}>{comments}</div>
                                            <div className={styles['comments-info']}>
                                                <span>2023-02-22 10:01</span>
                                                <div className={styles['interactions']}>
                                                    <div className={styles['like-option']} onClick={likeOption}>
                                                        {liked
                                                            ? (<MyIcon className={styles['icon']} type="icon-aixin" />)
                                                            : (<MyIcon className={styles['icon']} type="icon-weishoucang" />)
                                                        }
                                                        <span>{likeCount}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                </div>
                <div className={styles['footer-bar']}>
                    <div className={styles['options']}>
                        <div className={styles['left']}>
                            <span className={styles['like-wrapper']}>
                                <MyIcon className={styles['icon']} type="icon-weishoucang" />
                                <span className={styles['count']}>388</span>
                            </span>
                            <span className={styles['collect-wrapper']}>
                                <MyIcon className={styles['icon']} type="icon-shoucang" />
                                <span className={styles['count']}>111</span>
                            </span>
                            <span className={styles['chat-wrapper']} onClick={() => inputRef?.focus()}>
                                <MyIcon className={styles['icon']} type="icon-pinglun" />
                                <span className={styles['count']}>6</span>
                            </span>
                        </div>
                        <div className={styles['right']}>
                            <MyIcon type="icon-xiaolian" />
                        </div>
                    </div>
                    <div className={styles['outer']}>
                        <div className={styles['input-wrapper'] +" " + hasInput}>
                            <input type='text'
                                className={styles['input']}
                                placeholder={placeholder}
                                ref={input => inputRef=input}
                                onFocus={() => setPholder(undefined)}
                                onBlur={() => setPholder('请留下有爱的评论吧！')}
                                value={comments_}
                                onChange={handleInput}
                            />
                            <Popover 
                            title={null} 
                            content={<EmojiInput openChang = {handleOpenEmojiChange} emojiInput = {emojiInput}/>} 
                            trigger='click' 
                            open={isEmojiShow} 
                            onOpenChange={handleOpenEmojiChange}>
                                <div className={styles['emoji']} >
                                    <MyIcon type="icon-xiaolian" />
                                </div>
                            </Popover>

                        </div>
                            <Button className={styles['button']}>发送</Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NoteContent;