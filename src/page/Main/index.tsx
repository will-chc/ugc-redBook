import React, { useEffect, useState } from "react";
import styles from "./index.module.less"
import NoteItem from "../../components/NoteItem";
import { Modal } from 'antd';
import NoteContent from "../../components/NoteContent";
interface IFNoteItem {
  id: string,
  type: string,
  note_card: {
      cover: string,
      title: string,
      user: {
          nick_name: string,
          avatar: string,
          userId: string
      },
      liked_info: {
          liked: boolean,
          liked_count: string
      }
  }

}
// context 
import { NoteContext } from "../../Context";
const Main: React.FC = () => {

  // 示例数据
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


  // state
  const [curData, setaCurData] = useState(data); // 当前详情数据

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [arr, setArr] = useState([...new Array(20).fill(data), ...new Array(15).fill(data2)]);


  //context
  const NoteProvider = NoteContext.Provider;
  // 
  useEffect(() => {
    // 监听滚动
    document.addEventListener('scroll', loadNext);
    return () => {
      document.removeEventListener("scroll", loadNext);
    }
  }, [arr]);


  // function
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // 滚动加载
  const loadNext = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    const scrollHeight = document.documentElement.scrollHeight;
    if (scrollTop + clientHeight + 400 >= scrollHeight) {
      let newArr = new Array(10).fill(data);
      const A = [...arr, ...newArr];
      setArr(A);
    }
  }

  //查看详细笔记
  const showDetail = (item: IFNoteItem) => {
    setaCurData(item);
    setIsModalOpen(true);
  };


  return (
    <>
      <div className={styles['feeds-page']}>
        <ul>
          {arr.map((item) => {
            return <NoteItem key={item.id + Math.random()} item={item} showDetail={() => showDetail(item)} />
          })}
        </ul>
      </div>
      {
        isModalOpen
          ? (
            <Modal
              maskStyle={{ backgroundColor: 'hsla(0,0%,97.6%,.98)' }}
              title={null} open={isModalOpen}
              onCancel={handleCancel}
              footer={null}
              width={800}
            >
              <NoteProvider value={curData}>
                <NoteContent data={data} />
              </NoteProvider>
            </Modal>
          )
          : null
    }

    </>
  );
};

export default Main;