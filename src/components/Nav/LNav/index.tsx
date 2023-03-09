import React from "react";
import styles from './index.module.less';
import { useSelector } from "react-redux";
type NavItem = {
    label:string,
    key:string,
}
interface LNavIF {
    nav:NavItem[],
    changeKey:(key:string) => any;
}
const LNav: React.FC <LNavIF>= ({nav, changeKey}) => {
    const arr = ["hello",1,1,1];
    
    const state = useSelector((store:any)=>({
        activedKey:store.dataChartState.navState
    }));

    const getClassName = (key:string) =>{ 
        const { activedKey } = state;  
        if(activedKey === '' || !activedKey){
            changeKey(nav[0].key);
        }      
        if(key == activedKey) return styles['nav-item'] + " " + styles['actived'];
        else return styles['nav-item']
    }

    const handleClick = (key:string) => {        
        changeKey(key);
    }
    return (
        <div className={styles['nav-wrapper']}>
            {/* <div className={styles['nav-item'] + ' ' + styles['actived']}>1</div> */}
            {
                nav.map((item)=>(
                    <div className={getClassName(item.key)} key={item.key} onClick={() => handleClick(item.key)}>
                        {item.label}
                    </div>
                ))
            }
            
        </div>
    );
};

export default LNav;