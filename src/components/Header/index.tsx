import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import request from "../../server/request";
import styles from './index.module.less'

//action
import { setUserInfo, setPath } from "./reducer/actions";
import { connect } from "react-redux";
import { Popover } from "antd";
const mapStateToProps = (state: any) => ({
    info: state.userInfo.avatar,
    path: state.headerState.path
});
const mapDispatchToProps = {
    setUserInfo,
    setPath
}

interface User_Info {
    email: string,
    nickName: string,
    avatar: string,
    breif: string | undefined,
    followData: {
        fansCount: number,
        followCount: number
    }
}
interface FCprops {
    setUserInfo: (data: User_Info) => any,
    setPath: (path: string) => any,
    info: User_Info,
    path: string

}
const Header: React.FC<FCprops> = ({ setUserInfo, info, path, setPath }) => {
    const menu = [
        {
            label: '首页',
            path: "/explore"
        },
        {
            label: '创作',
            path: "/create"
        },
        {
            label: '数据查看',
            path: '/data_viewing'
        },
        {
            label: "个人主页",
            path: `/user_page/${localStorage.getItem('userId')}`
        }
    ];
    const [avatar, setAvatar] = useState<string>('');

    useEffect(() => {
        request('/userInfo', { user_id: localStorage.getItem('userId') }, "get").then((res: any) => {
            const { avatar } = res;
            setAvatar(avatar);
            setUserInfo(res);
        });

    }, [])
    const history = useHistory();
    const handlePush = (path: string) => {
        history.push(path);
        setPath(path);
    }
    return (
        <header className={styles['header']}>
            <a className={styles['icon']} href="http://localhost:5173/">
                <img src="src/assets/111.png" width="60px" />
            </a>
            <div className={styles['right']}>
                <div className={styles['navbar']}>
                    {
                        menu.map((item) => {
                            return (
                                <div className={styles['nav-item'] + " " + (item.path == history.location.pathname ? styles['active'] : "")} key={item.path} onClick={() => handlePush(item.path)}>
                                    <span>{item.label}</span>
                                </div>
                            )
                        })
                    }

                </div>
                <div className={styles['user']}>
                    <Popover
                        title={null}
                        content={<DropDown />}
                        trigger='hover'>
                        <img className={styles['avatar']}
                            src={avatar}
                        />
                    </Popover>

                </div>
            </div>
        </header>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);

const DropDown: React.FC = () => {
    return (
        <div className={styles['drop-down']}>
            {
                localStorage.getItem('token')
                    ?
                    <>
                        <span>修改资料</span>
                        <span>退出登录</span>
                    </>
                    : <span>登录</span>
            }

        </div>
    )
}