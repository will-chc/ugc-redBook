import { Input, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import { Map, Marker } from 'react-amap';
import styles from './index.module.less';
import AMapLoader from "@amap/amap-jsapi-loader";
interface FCprops {
    open: boolean,
    setOpen: (open: boolean) => void
}
const { AMap } = window;
const UAMap: React.FC<FCprops> = ({ open, setOpen }) => {

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
        console.log(pois);

    }, [pois])

    const mapEvent = {
        //点击获取地图经纬度和地标名称
        click: ({ lnglat: { lat, lng } }) => {
            AMap.plugin('Amap.Geocoder', () => {
                const geocoder = new AMap.Geocoder({
                    city: '广州',
                    citylimit: false
                });
                geocoder.getAddress([lng, lat], (status: string, result: any) => {
                    console.log(status, result);

                    if (status == 'complete' && result.info === 'OK') {
                        console.log(lng, lat, result?.regeocode?.formattedAddress);
                        setCenter({
                            lng, lat, name: result?.regeocode?.formattedAddress
                        })
                    }
                })
            });
        }
    }
    const handleSearch = (val: string, isFocus = false) => {

        if (isFocus && pois.length) return;

        const place = new AMap.PlaceSearch(searchConfig);
        place.search(val, (status: string, result: any) => {
            const { info, poiList } = result;
            console.log(result);

            if (status == 'complete' && result.info === 'OK') {
                console.log(poiList);

                if (poiList.pois && Array.isArray(poiList.pois)) {
                    console.log(poiList.pois);
                    setPois([...poiList.pois]);
                }
            }
        });
    }

    const hanldeChange = (id: string) => {
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
                    placeholder='选择地址'
                    value={center.name}
                    onSearch={handleSearch}
                    onChange={hanldeChange}
                >
                    {pois.map(op => {
                        return (
                            <Select.Option key={op.id} value={op.id}>{op.name}</Select.Option>
                        )
                    })}
                </Select>
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
                                    // 异步加载AMap.Autocomplete插件：输入提示，根据输入关键字提示匹配信息
                                    AMap.plugin('AMap.Autocomplete', () => {
                                        auto = new AMap.Autocomplete({
                                            input: 'tipinput',
                                            outPutDirAuto: true,
                                            ...searchConfig
                                        })
                                    })
                                    // 异步加载AMap.PlaceSearch插件：地点搜索服务插件，提供某一特定地区的位置查询服务
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

export default UAMap;