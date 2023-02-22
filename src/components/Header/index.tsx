import React from "react";
import styles from './index.module.less'

const Header: React.FC  = () => {
    return (
        <header className={ styles.header }>
            <a className={styles.icon} href="http://localhost:5173/">
            <img src="src/assets/111.png" width="60px"/>
            </a>
        </header>
    );
};

export default Header;