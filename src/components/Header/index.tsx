import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import styles from './index.module.less'

const Header: React.FC  = () => {
    const menu = [
        {
            label:'首页',
            path:"/explore"
        },
        {
            label:'创作',
            path:"/create"
        },
        {
            label:'数据查看',
            path:'/data_viewing'
        },
        {
            label:"个人主页",
            path:'/user_page'
        }
    ];

    const history = useHistory();
    const handlePush = (path:string) => {
        history.push(path);
    }
    return (
        <header className={ styles['header'] }>
            <a className={styles['icon']} href="http://localhost:5173/">
            <img src="src/assets/111.png" width="60px"/>
            </a>
            <div className={styles['right']}>
                <div className={styles['navbar']}>
                    {
                        menu.map((item) => {
                            return (
                                <div className={styles['nav-item'] + " " + (item.path == history.location.pathname ? styles['active'] : "")} key={item.path} onClick={()=> handlePush(item.path)}>
                                    <span>{item.label}</span>
                                </div>
                            )
                        })
                    }
                    
                </div>
                <div className={styles['user']}>
                    <img className={styles['avatar']}
                        src='https://sns-avatar-qc.xhscdn.com/avatar/6222018f9c623248c224cd83.jpg?imageView2/2/w/360/format/webp'
                     />
                </div>
            </div>
        </header>
    );
};

export default Header;