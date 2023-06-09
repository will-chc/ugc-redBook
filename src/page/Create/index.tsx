import React, { useEffect, useState } from "react";
import styles from './index.module.less';
import { Upload, Button, UploadFile, message, Progress, Modal, } from "antd";
import { MyIcon } from "../../Icon/MyIcon";
import { RcFile } from "antd/lib/upload";
import ImgEditor from "../../components/ImgEditor";
import TextEditor from "./components/TextEditor";
import Preview from "../../components/PreView";
//action
import { useSelector } from "react-redux";
import request from "../../server/request";
import { useHistory } from "react-router-dom";

const CreatePage: React.FC = () => {
    const tips = [
        ['图片大小', '支持上传的图片大小，', '最大5M的图片文件'],
        ['图片格式 ', '支持上传的图片格式，', '推荐使用png、jpg、jpeg、webp'],
        ['图片分辨率', '推荐上传宽高比为3:4，', '超过1280P的图片用网页端上传画质更清晰'],
    ]

    const maxImgCount = 6;
    const [imgArr, setImgArr] = useState<string[]>([]);

    //state 
    const [isEdit, setIsEdit] = useState(false);
    const [fileList_, setFileList_] = useState<RcFile[]>();
    const [addCount, setAddCount] = useState((maxImgCount - imgArr.length) > 0 ? (maxImgCount - imgArr.length) : 1);
    const [isImgEditorOpen, setIsImgEditorOpen] = useState(false);

    const state = useSelector((store: any) => ({
        text: store.textState,
        address: store.mapState.address
    }));
    const history = useHistory();

    // functon 
    const handleUploadChange = (info: any) => {
        const { fileList } = info;
        let arr: string[] = [];
        for (let i = 0; i < fileList.length; i++) {
            const { status } = fileList[i];
            if (status === 'done') {
                const { response } = fileList[i];
                arr.push(response.src);
            }
            setImgArr([...arr]);
            setAddCount((maxImgCount - arr.length) > 0 ? (maxImgCount - arr.length) : 1);
            const isUploadCompleted = fileList.every((file: any) => file.status === 'done');
            if (isUploadCompleted) {
                console.log('所有文件上传完成');
                setFileList_(fileList);
                setIsEdit(true);
            }
        }
    }
    const handleAddUploadChange = (info: any) => {
        const { fileList } = info;
        if (fileList.every((e: any) => e.status === 'done')) {
            const arr = fileList.map((e: any) => e.response.src);
            const newArr = new Set([...arr]);
            setImgArr([...newArr]);
        }
    }

    const beforeUpload = (file: RcFile, fileList: RcFile[]) => {
        if (imgArr.length >= 6) {
            message.error('最多上传6张照片');
            return false;
        }

        const timestamp = new Date().getTime(); // 获取当前时间戳
        const newFilename = `${timestamp}_${file.name}`; // 给文件名加上时间戳

        // 将修改后的文件名赋值回去
        Object.defineProperty(file, 'name', {
            writable: true,
            value: newFilename,
        });

        return true;
    }
    const delImg = (i: number) => {
        if (imgArr.length == 1) {
            message.error('必须要有一张图片');
            return;
        }
        imgArr.splice(i, 1);
        setImgArr([...imgArr]);

    }

    const handleSubmit = () => {
        const param = {
            imgArr,
            ...state
        };
        request('/create_note', param, "post").then(res => {
            message.success('发布成功');
            history.push(`/user_page/${localStorage.getItem('userId')}`);
        });
    }

    return (
        <>
            <div className={styles['feeds-page']}>
                <div className={styles['wrapper']}>
                    <header className={styles['header']}>
                        <span className={styles['tab-item']}>上传图文</span>
                    </header>
                    {
                        isEdit == false && (
                            <div className={styles['upload-area']}>
                                <div className={styles['upload-wrapper']}>
                                    <Upload
                                        showUploadList={false}
                                        action='http://localhost:5000/uploadImg'
                                        onChange={handleUploadChange}
                                        multiple
                                        beforeUpload={beforeUpload}
                                        maxCount={maxImgCount}
                                    >
                                        <div className={styles['uploadBtn']}>
                                            <MyIcon style={{ fontSize: 36 }} type="icon-shangchuan" />
                                            <Button>点击上传</Button>
                                        </div>
                                    </Upload>
                                </div>
                                <div className={styles['tips']}>
                                    {tips.map((tip) => {
                                        return (
                                            <div className={styles['tip']} key={tip[0]}>
                                                <span>{tip[0]}</span>
                                                <span>{tip[1]}</span>
                                                <span>{tip[2]}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    }

                    {
                        isEdit && (
                            <div className={styles['edit-wrapper']}>

                                {/* 图片编辑 */}

                                <div className={styles['img-edit-wrapper']}>
                                    <div className={styles['img-edit-header']}>
                                        图片编辑
                                        <Upload
                                            showUploadList={false}
                                            action='http://localhost:5000/uploadImg'
                                            onChange={handleAddUploadChange}
                                            multiple
                                            defaultFileList={fileList_}
                                            beforeUpload={beforeUpload}
                                            maxCount={addCount}
                                        >
                                            <span className={styles['addImgBtn']}>添加图片</span>
                                        </Upload>
                                    </div>
                                    <div className={styles['img-edit']}>
                                        {imgArr.map((imgSrc, i) => {
                                            return (
                                                <div className={styles['img-wrapper']} key={imgSrc + i}>
                                                    <img src={imgSrc} width={120} />
                                                    <span
                                                        onClick={() => delImg(i)}
                                                        className={styles['close']}>
                                                        x
                                                    </span>
                                                    <span className={styles['edit-btn']} onClick={() => setIsImgEditorOpen(true)}>编辑</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div className={styles['text-edit-wrapper']}>
                                    <div className={styles['text-edit-header']}>
                                        内容编辑
                                    </div>
                                    <TextEditor cover={imgArr[0]} />
                                    <Button className={styles['confirm-btn']} onClick={handleSubmit}>确认</Button>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
            {isImgEditorOpen
                ? (
                    <Modal
                        title='图片编辑'
                        footer={null}
                        open={isImgEditorOpen}
                        onCancel={() => setIsImgEditorOpen(false)}
                        wrapClassName={styles['editor-modal']}
                        width={900}
                    >
                        <ImgEditor imgArr={imgArr} setImgArr={setImgArr} setIsImgEditorOpen={setIsImgEditorOpen} />
                    </Modal>
                ) : null
            }

        </>
    );
};


export default CreatePage;