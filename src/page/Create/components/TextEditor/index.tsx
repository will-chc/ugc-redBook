import { Form, Input, Popover } from "antd";
import React, { useState } from "react";
import styles from './index.module.less';
import EmojiInput from "../../../../components/EmojiInput";
import UAMap from "../../../../components/UAMap";
import { MyIcon } from "../../../../Icon/MyIcon";
import Preview from "../../../../components/PreView";
//action
import { changeContent,changeTitle } from "../../reducer/actions";
import { connect } from "react-redux";
const mapStateToProps = (state: any) => ({
    title: state.textState.title,
    content: state.textState.content
  });
  const mapDispatchToProps = {
    changeTitle,
    changeContent
  }


interface FCprops {
    cover:string,
    changeTitle:(title:string|undefined) => any;
    changeContent:(content:string|undefined) => any;
}
const FormItem = Form.Item;

const TextEditor: React.FC <FCprops>= ({cover,changeContent,changeTitle}) => {
    const [form] = Form.useForm();

    const [isEmojiShow, setIsEmojiShow] = useState(false);

    const [icon, setIcon] = useState('icon-dizhi');

    const [mapOpen, setMapOpen] = useState(false);

    
    const [address, setAddress] = useState({
        lng: 113.298338,
        lat: 23.135697,
        name: '广工大宿舍'
    });

    const handleOpenEmojiChange = (open: boolean) => {
        setIsEmojiShow(open);
    }
  
    const validator = (rule:any,val:string) => {
        if(!val) return
        if(val.length < 1) return Promise.reject('不能为空');
    }
    const addContent =(add:string) => {
        const {getFieldValue, setFieldValue} = form;
        let content = getFieldValue('content');
        if(content === undefined) content = "";
        content += add;
        setFieldValue('content',content);
    }
    const handleTitleChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        const {value} = e.target;
        changeTitle(value);
    }
    const handleContentChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
        const {value} =  e.target;
        changeContent(value);
    }
    return (
        <div className={styles['text-wrapper']}>
            <Form form={form}>
                <FormItem name='title' label='标题' rules={[
                    {validator:validator}
                ]}>
                    <Input placeholder="填写标题，可能会有更多的赞喔！"  max={12} onChange={handleTitleChange}/>
                </FormItem>
                <FormItem name='content' label='内容'  rules={[
                    {validator:validator}
                ]}>
                    <Input.TextArea rows={4} placeholder='描写更多的信息，让更多人看到你吧' onChange={handleContentChange}/>
                </FormItem>
                <div className={styles['btns']}>
                    <span onClick={()=>addContent("#")}># 话题</span>
                    <span onClick={()=>addContent('@')}>@用户</span>
                    <Popover
                        title={null}
                        content={<EmojiInput openChang={handleOpenEmojiChange} emojiInput={addContent} />}
                        trigger='click'
                        open={isEmojiShow}
                        onOpenChange={handleOpenEmojiChange}>
                        <span >😊表情</span>
                    </Popover>
                </div>
                <div  className={styles['setttings']}>
                    <div className={styles['header']}>发布设置</div>
                    <FormItem  label='添加地点  '>
                        <div className={styles['address']}>
                        <span 
                            className={styles['icon-wrapper']} 
                            onClick={() => setMapOpen(true)} 
                            onMouseOver={()=>setIcon('icon-dizhi1')}
                            onMouseLeave={()=>setIcon('icon-dizhi')}
                            >
                            <MyIcon type={icon}/>
                        </span>
                        </div>
                    </FormItem>
                    <UAMap open={mapOpen} setOpen={setMapOpen} />
                </div>
            </Form>
            {/* <div className={styles['preview']}><Preview cover={cover} title={title} /></div> */}
        </div>
    );
};

// export default TextEditor;
export default connect(mapStateToProps, mapDispatchToProps)(TextEditor);