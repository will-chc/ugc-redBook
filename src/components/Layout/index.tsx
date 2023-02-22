import React from "react";
import styles from './index.module.less';
import Header from "../Header";
import {Modal} from 'antd'
const Layout: React.FC = ( { children} ) => {
    return (
        <div>
            <Header />
            <div >
            {children}
            </div>
        </div>
    );
};
export default Layout;