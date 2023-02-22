import React, { ReactNode } from "react";
import styles from './index.module.less';
import Header from "../Header";

interface FCprops {
    children:ReactNode
}
const Layout: React.FC<FCprops> = ( { children} ) => {
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