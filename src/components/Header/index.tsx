import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import request from "../../server/request";
import styles from './index.module.less'

//action
import { setUserInfo } from "./reducer/actions";
import { connect } from "react-redux";
const mapStateToProps = (state: any) => ({
    userInfo:state.useInfo
  });
  const mapDispatchToProps = {
    setUserInfo
  }

interface User_Info {
    email:string,
    nickName:string,
    avatar:string,
    breif:string | undefined,
    followData:{
        fansCount:number,
        followCount:number
    }
}
interface FCprops {
    setUserInfo:(data:User_Info) => any;
}
const Header: React.FC<FCprops>  = ({setUserInfo}) => {
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
            path:`/user_page/${localStorage.getItem('userId')}`
        }
    ];
    const [avatar, setAvatar] = useState<string>('');

    useEffect(()=>{
        request('/userInfo',{user_id:localStorage.getItem('userId')},"get").then((res:any)=>{
            const { avatar } = res;
            setAvatar(avatar);
            setUserInfo(res);
        })
    },[])
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
                        src={avatar}
                     />
                </div>
            </div>
        </header>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);