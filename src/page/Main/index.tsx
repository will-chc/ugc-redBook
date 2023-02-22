import React, { useEffect, useState } from "react";
import styles from "./index.module.less"
import NoteItem from "../../components/NoteItem";
import './index.css';
import { Modal } from 'antd';
import NoteContent from "../../components/NoteContent";
const Main: React.FC = () => {
  const data = {
    id: '63e4f47a0000000004006523',
    type: '2',
    note_card: {
      cover: 'https://sns-img-hw.xhscdn.com/00c73e32-22ad-c0a2-9898-3a36b977116c',
      title: '30岁未婚独居，一定要让自己有个温馨的小家',
      user: {
        nick_name: '王小仙',
        avatar: 'https://sns-avatar-qc.xhscdn.com/avatar/616e2c9c38d73a10f960b967.jpg?imageView2/2/w/540/format/webp',
        userId: '5ba715bd4610d200015b901a'
      },
      liked_info: {
        liked: false,
        liked_count: '1k+'
      }
    }
  }
  const data2 = {
    id: '63e4f47a0000000004006523',
    type: '1',
    note_card: {
      cover: 'https://sns-img-hw.xhscdn.com/9040ca79-22fb-14ea-43f0-401ab1088c75?imageView2/2/w/648/format/webp',
      title: '30岁未婚独居，一定要让自己有个温馨的小家',
      user: {
        nick_name: '王小仙',
        avatar: 'https://sns-avatar-qc.xhscdn.com/avatar/616e2c9c38d73a10f960b967.jpg?imageView2/2/w/540/format/webp',
        userId: '5ba715bd4610d200015b901a'
      },
      liked_info: {
        liked: false,
        liked_count: '1k+'
      }
    }
  }
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [arr, setArr] = useState([...new Array(20).fill(data), ...new Array(15).fill(data2)]);
  useEffect(() => {
    document.addEventListener('scroll', loadNext);
    return () => {
      document.removeEventListener("scroll", loadNext);
    }
  }, [arr])

  const handleOk = () => {
    setIsModalOpen(true);
    console.log(12321,isModalOpen);
    
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    console.log(432,isModalOpen);
    
  };
  const loadNext = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    const scrollHeight = document.documentElement.scrollHeight;
    if (scrollTop + clientHeight + 400 >= scrollHeight) {
      let newArr = new Array(10).fill(data);
      const A = [...arr, ...newArr];
      setArr(A);
      console.log(A);


    }
  }
  return (
    <>
    <div className={styles['feeds-page']}>
      <ul>
        <div onClick={handleOk}>11ddd</div>
        {arr.map((item) => {
          return <NoteItem item={item} />
        })}
      </ul>
    </div>
    <Modal wrapClassName="wrapper"
      maskStyle={{backgroundColor:'hsla(0,0%,97.6%,.98)'}}
      title={null} open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={800}
      >
        <NoteContent data={data}/>
        </Modal>
    </>
  );
};

export default Main;