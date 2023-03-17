import React, { ReactEventHandler, useContext, useEffect, useState } from "react";
import styles from './index.module.less';
import { LeftCircleOutlined, RightCircleOutlined } from "@ant-design/icons";
import { NoteContext } from "../../Context";
import { Button, Popover } from "antd";
import EmojiInput from "../EmojiInput";
import { MyIcon } from "../../Icon/MyIcon";
import request from "../../server/request";
import { formatTime } from "../../utils/common";

interface noteCard {
    id: string,
    user_id: string,
    title: string,
    cover_image: string,
    liked: boolean,
    likedCount: number,
    userInfo: {
        nickName: string,
        avatar: string
    }
}
interface RCprops {
    data: noteCard
}
interface typeComment {
    avatar: string,
    id: number,
    nickname: string,
    user_id: number,
    content: number,
    created_at: Date,
    liked: boolean,
    likedCount: number,
}
const NoteContent: React.FC<RCprops> = ({ data }) => {
    const { userInfo } = data;
    const tag = '#小米13#小米手机#小米#数码#数码街区由我造#一起聊数码#手机';
    let inputRef: HTMLInputElement | null;

    // state
    const [cur, setCur] = useState(0);
    const [liked, setLiked] = useState(data.liked);
    const [isShow, setIsShow] = useState(false);
    const [placeholder, setPholder] = useState<string | undefined>('请留下有爱的评论吧！');
    const [isEmojiShow, setIsEmojiShow] = useState(false);
    const [comments_, setComments_] = useState<string | number | readonly string[] | undefined>("");
    const [hasInput, setHasInput] = useState<string | undefined>("");

    const [ImgArr, setImgArr] = useState<string[]>([]);
    const [note, setNote] = useState({ title: '', content: '', address: '', created_at: '' });
    const [userId, setUserId] = useState(0);
    const [isFollowed, setIsFollowed] = useState(false);

    const [commentList, setCommentList] = useState<typeComment[]>([]);

    const [likedCount, setLikedCount] = useState(data.likedCount);

    useEffect(() => {
        request('/note_detail', { id: data.id }).then((res: any) => {
            const { img_arr, title, content, user_id, created_at } = res;
            setImgArr(img_arr);
            setNote({ title, content, address: res.location.name, created_at: formatTime(created_at) });
            setUserId(user_id);
            request('/isfollow', { followee_id: user_id, follower_id: Number(localStorage.getItem('userId')) }).then((res: any) => {
                const { isFollowed } = res;
                setIsFollowed(isFollowed);
            })
        });
        // 获取评论 
        request('/comment_list', { id: data.id, my_id: Number(localStorage.getItem('userId')) }).then((res: any) => {
            const { comments } = res;
            setCommentList(comments);
        })
    }, [])
    // function 

    const preImg = () => {
        cur === 0 ? setCur(ImgArr.length - 1) : setCur(cur - 1);
    }
    const nextImg = () => {
        cur === ImgArr.length - 1 ? setCur(0) : setCur(cur + 1);
    }
    const showOption = () => {
        if (ImgArr.length === 1) {
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
        request('/like', {
            note_id: data.id,
            user_id: localStorage.getItem('userId'),
            liked: !liked
        }, "post").then(res => {
            console.log(res);
        })
        setLiked(!liked);
        setLikedCount(liked ? likedCount - 1 : likedCount + 1);
    }

    const handleOpenEmojiChange = (open: boolean) => {
        setIsEmojiShow(open);
    }

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setComments_(e.target.value);
        if (e.target.value) {
            setHasInput(styles['hasInput']);
        }
        else {
            setHasInput("");
        }

    }
    const emojiInput = (emoji: string) => {
        comments_ ? setComments_(comments_ + emoji) : setComments_(emoji);
        setHasInput(styles['hasInput']);
    }

    // 关注
    const handleFollow = (new_follow: boolean) => {
        request('/follow', {
            follower_id: Number(localStorage.getItem('userId')),
            followee_id: userId,
            new_follow
        }, 'post').then((res: any) => {
            const { isFollowed } = res;
            setIsFollowed(isFollowed);
        })
    }
    // 评论
    const handleComment = () => {
        const note_id = data.id;
        const user_id = Number(localStorage.getItem('userId'));
        request('/comment', { note_id, user_id, comments_ }, "post").then(res => {
            // 获取评论 
            request('/comment_list', { id: data.id, my_id: user_id }).then((res: any) => {
                const { comments } = res;
                console.log(comments, "@@@");

                setCommentList(comments);
            });
            setComments_('');
            setHasInput("");
        })

    }

    // tsx
    const renderFollowerBtn = () => {
        if (localStorage.getItem('userId') == data.user_id) return null;
        if (isFollowed) {
            return <div className={styles['followed-option']} onClick={() => handleFollow(false)}>已关注</div>
        }
        else {
            return <div className={styles['follow-option']} onClick={() => handleFollow(true)}>关注</div>
        }

    }

    return (
        <>
            <div className={styles['media-wrapper']} onMouseOver={showOption} onMouseOut={hiddenOption}>
                <img src={ImgArr[cur]} />
                {isShow ? (
                    <>
                        <span className={styles['img-count']}>{cur + 1}/{ImgArr.length}</span>
                        <LeftCircleOutlined className={styles['left_']} onClick={preImg} />
                        <RightCircleOutlined className={styles['right_']} onClick={nextImg} />
                    </>
                ) : null}
            </div>
            <div className={styles['interaction-container']}>
                <div className={styles['header']}>
                    <div className={styles['info']}>
                        <img className={styles['avatar']} src={userInfo.avatar} />
                        <span className={styles['name']}>{userInfo.nickName}</span>
                    </div>
                    {/* {
                        isFollowed
                        ? <div className = {styles['followed-option']} onClick={()=>handleFollow(false)}>已关注</div>
                        : <div className = {styles['follow-option']} onClick={()=>handleFollow(true)}>关注</div>
                    } */}
                    {
                        renderFollowerBtn()
                    }

                </div>
                <div className={styles['note-scroll']}>
                    <div className={styles['content']}>
                        <div className={styles['title']}>{note.title}</div>
                        <div className={styles['desc'] + " " + styles['p-spacing']}>
                            {note.content}

                        </div>
                        <div className={styles['desc']}>{tag}</div>
                        <div className={styles['date']}>{note.created_at}</div>
                        <div className={styles['date']}> {note.address}</div>

                    </div>
                    <div className={styles['comments-container']}>
                        <div className={styles['total']}>共{commentList.length}条评论</div>

                        {/* 评论 */}
                        <div className={styles['list-container']}>
                            {commentList.map((list_item) => {
                                return (
                                    <Comments list_item={list_item} />
                                )
                            })}
                        </div>
                    </div>

                </div>
                <div className={styles['footer-bar']}>
                    <div className={styles['options']}>
                        <div className={styles['left']}>
                            <span className={styles['like-wrapper']} onClick={likeOption}>
                                {liked
                                    ? (<MyIcon className={styles['icon']} type="icon-aixin" />)
                                    : (<MyIcon className={styles['icon']} type="icon-weishoucang" />)
                                }
                                <span className={styles['count']}>{likedCount}</span>
                            </span>
                            <span className={styles['collect-wrapper']}>
                                <MyIcon className={styles['icon']} type="icon-shoucang" style={{marginRight:20}}/>
                                {/* <span className={styles['count']}>111</span> */}
                            </span>
                            <span className={styles['chat-wrapper']} onClick={() => inputRef?.focus()}>
                                <MyIcon className={styles['icon']} type="icon-pinglun" />
                                <span className={styles['count']}>{commentList.length}</span>
                            </span>
                        </div>
                        <div className={styles['right']}>
                            <MyIcon type="icon-xiaolian" />
                        </div>
                    </div>
                    <div className={styles['outer']}>
                        <div className={styles['input-wrapper'] + " " + hasInput}>
                            <input type='text'
                                className={styles['input']}
                                placeholder={placeholder}
                                ref={input => inputRef = input}
                                onFocus={() => setPholder(undefined)}
                                onBlur={() => setPholder('请留下有爱的评论吧！')}
                                value={comments_}
                                onChange={handleInput}
                            />
                            <Popover
                                title={null}
                                content={<EmojiInput openChang={handleOpenEmojiChange} emojiInput={emojiInput} />}
                                trigger='click'
                                open={isEmojiShow}
                                onOpenChange={handleOpenEmojiChange}>
                                <div className={styles['emoji']} >
                                    <MyIcon type="icon-xiaolian" />
                                </div>
                            </Popover>

                        </div>
                        <Button className={styles['button']} onClick={handleComment}>发送</Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NoteContent;

interface CommentsProps {
    list_item: typeComment
}
const Comments: React.FC<CommentsProps> = ({ list_item }) => {
    const [liked, setLiked] = useState(list_item.liked);
    const [likedCount, setLikedCount] = useState(list_item.likedCount);
    const likeOption = () => {
        const user_id = Number(localStorage.getItem('userId'));
        request('/comments_like', {user_id, comment_id:list_item.id, likeStatus:!liked}).then(res=>{
            console.log(res);
        })
        setLiked(!liked);
        setLikedCount(liked ? likedCount - 1 : likedCount + 1 );
    }
    return (
        <div className={styles['comments-item']} key={Math.random()}>
            <div className={styles['avatar']}>
                <img src={list_item.avatar} alt="" width={32} height={32} />
            </div>
            <div className={styles['comments-body']}>
                <div className={styles['name-wrapper']}>
                    <span className={styles['name']}>{list_item.nickname}</span>
                </div>
                <div className={styles['content']}>{list_item.content}</div>
                <div className={styles['comments-info']}>
                    <span>{formatTime(list_item.created_at)}</span>
                    <div className={styles['interactions']}>
                        <div className={styles['like-option']} onClick={likeOption}>
                            {liked
                                ? (<MyIcon className={styles['icon']} type="icon-aixin" />)
                                : (<MyIcon className={styles['icon']} type="icon-weishoucang" />)
                            }
                            <span>{likedCount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}