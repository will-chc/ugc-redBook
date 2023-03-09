import { Input, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import { Map, Marker } from 'react-amap';
import styles from './index.module.less';
import { throttle } from "../../utils/common";
import { loadPlugin } from "./utils/loadPlugin";


//actions
import { changeAddress } from "./reducer/actions";
import { connect, Connect } from "react-redux";
const mapStateToprops = (store: any) => ({
    address: store.mapState.address
});
const mapDispatchToProps = {
    changeAddress
}
interface FCprops {
    open: boolean,
    setOpen: (open: boolean) => void,
    changeAddress: (address: any) => any
}
const { AMap } = window;
const UAMap: React.FC<FCprops> = ({ open, setOpen, changeAddress }) => {

    // AMap Plugin
    let placeSearch: any;

    const [center, setCenter] = React.useState({
        lng: 113.298338,
        lat: 23.135697,
        name: '广工大宿舍'
    });


    //暂存搜索项列表
    const [pois, setPois] = useState<any[]>([]);
    const searchConfig = {
        pageSize: 10,
        pageIndex: 1,
        citylimit: false, // 搜索时是否限制城市
        city: '广州' // 初始城市，如果citylimit: true,那就限定在改城市内搜索
    }
    useEffect(() => {
        loadPlugin('AMap.PlaceSearch', () => {
            placeSearch = new AMap.PlaceSearch({
                input: 'tipinput',
                ...searchConfig
            })
        });
        changeAddress(center);

    }, []);

    const mapEvent = {
        //点击获取地图经纬度和地标名称
        click: ({ lnglat: { lat, lng } }) => {
            loadPlugin('Amap.Geocoder', () => {
                const geocoder = new AMap.Geocoder({
                    city: '广州',
                    citylimit: false
                });
                geocoder.getAddress([lng, lat], (status: string, result: any) => {
                    console.log(status, result);

                    if (status == 'complete' && result.info === 'OK') {
                        const address = {
                            lng, lat, name: result?.regeocode?.formattedAddress
                        }
                        setCenter(address);
                        changeAddress(address)
                    }
                })
            });
        }
    }
    const handleSearch = (val: string, isFocus = false) => {

        if (isFocus && pois.length) return;
        // 节流 
        throttleSearch(val)
    }
    const searchPlace = (val: string) => {

        const placeSearch = new AMap.PlaceSearch({
            input: 'tipinput',
            ...searchConfig
        });
        placeSearch.search(val, (status: string, result: any) => {
            const { info, poiList } = result;
            console.log(result);

            if (status == 'complete' && result.info === 'OK') {

                if (poiList.pois && Array.isArray(poiList.pois)) {
                    setPois([...poiList.pois]);
                    console.log("更新");
                }
            }
        });
    }
    const throttleSearch = throttle(searchPlace, 1000);


    const handleChange = (id: string) => {
        console.log(11111);

        const signAddList = pois?.find(item => item.id === id);
        if (signAddList) {
            setCenter({
                lng: signAddList?.location.lng,
                lat: signAddList?.location.lat,
                name: signAddList?.name
            });
        }
    }

    return (
        <Modal
            open={open}
            onCancel={() => setOpen(false)}
            wrapClassName={styles['wrapper']}
            width={648}
            title='选择地址'
        >
            <div className={styles['search']}>
                <Select
                    showSearch
                    className={styles['select']}
                    value={center.name}
                    placeholder='选择地址'
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                    onSearch={handleSearch}
                    onChange={handleChange}
                    notFoundContent={null}
                    options={(pois || []).map(p => ({
                        value: p.id,
                        label: p.name,
                    }))}
                />
            </div>
            <div className={styles['AMap-wrapper']}>
                <Map key='12dd575d65937dd7a2a741cb27372852'
                    center={center}
                    zoom={16}
                    events={mapEvent}
                >
                    {center && (
                        // 创建一个地图图标(指向当前指向坐标)
                        <Marker
                            position={center} // 坐标（经纬度）
                            // 绑定事件，实现搜索定位的api
                            events={{
                                // created必须要拥有,用来初始化搜索工具
                                created: () => {
                                    let auto;
                                    let placeSearch: any;
                                    AMap.plugin('AMap.PlaceSearch', () => {
                                        placeSearch = new AMap.PlaceSearch({
                                            input: 'tipinput',
                                            ...searchConfig
                                        })
                                    })
                                    AMap.event.addListener(auto, 'select', (e: any) => {
                                        placeSearch.search(e.poi.name)
                                    })
                                }
                            }}
                        />
                    )}
                </Map>
            </div>
        </Modal>
    )
}

// export default UAMap;
export default connect(mapStateToprops, mapDispatchToProps)(UAMap);