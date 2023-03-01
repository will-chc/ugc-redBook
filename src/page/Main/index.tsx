import React, { useEffect, useState } from "react";
import styles from "./index.module.less"
import NoteItem from "../../components/NoteItem";
import { Modal, Form, Input, Button } from 'antd';
import NoteContent from "../../components/NoteContent";
import { MyIcon } from "../../Icon/MyIcon";
//reg
import { EmailReg, PasswordReg } from "../../utils/regex";
// context 
import { NoteContext } from "../../Context";


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
const FormItem = Form.Item;

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


  const [form] = Form.useForm();

  // state
  const [curData, setaCurData] = useState(data); // 当前详情数据

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [arr, setArr] = useState([...new Array(20).fill(data), ...new Array(15).fill(data2)]);

  const [loginBtn, setLoginBtn] = useState(true);

  const [mode, setMode] = useState('signUp');

  const [isLogin, setILogin] = useState(Boolean(localStorage.getItem('token')));



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

  // 校验
  const checkEmail = (rules: any, value: any) => {
    if (!value) {
      setLoginBtn(true);
      return Promise.reject('');
    }

    if (!EmailReg.test(value)) {
      setLoginBtn(true);
      return Promise.reject('请输入正确的邮箱');
    }

    const { validateFields } = form;
    if (loginBtn) {
      validateFields(['password']).catch(err => {
        console.error("password error", err);
        return Promise.resolve();
      });
      setLoginBtn(false);
    }


  }

  const checkPasswrod = (rules: any, value: any) => {
    if (!value || value.length < 6) {
      setLoginBtn(true);
      return Promise.reject("");
    }
    const { validateFields } = form;
    if (loginBtn) {
      validateFields(['email']).catch(err => {
        console.error("email error", err);
        return Promise.resolve();
      });
      setLoginBtn(false);
    }
  }

  // login
  const handleLogin = () => {
    const { getFieldsValue } = form;
    const { email, password } = getFieldsValue();
    console.log(email, password);
    setILogin(true);
  }

  // style
  const styleControl = (str: string) => {
    if (mode == 'signIn') return " " + str;
    return "";
  }


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
              wrapClassName={styles['main-modal']}
            >
              <NoteProvider value={curData}>
                <NoteContent data={data} />
              </NoteProvider>
            </Modal>
          )
          : null
      }
      {
        !isLogin
          ? (
            <Modal title={null}
              footer={null}
              width={680}
              open={!isLogin}
              onCancel={() => setILogin(true)}
              className={styles['login-box']}
              wrapClassName={styles['main-modal']}
            >
              <div className={styles['left']}>
                <div className={styles['smile']}>
                  <MyIcon className={styles['smile-icon']} type='icon-smile-fill' onClick={() => setMode('signIn')} />
                </div>
                <div className={styles['register'] +styleControl(styles['register-show'])}>
                  <div className={styles['title']}>账号注册</div>
                  <div className={styles['input-container']}>
                    <Form form={form} >
                      <FormItem name='email'
                        rules={[
                          {
                            validator: checkEmail
                          }
                        ]}>
                        <Input placeholder="输入邮箱账号" />
                      </FormItem>
                      <FormItem name='password'
                        rules={[
                          {
                            validator: checkPasswrod
                          }
                        ]}
                      >
                        <Input placeholder="输入密码" />  
                      </FormItem>
                      <Button disabled={loginBtn} className={styles['button']} onClick={handleLogin} >注册账号</Button>
                    </Form>
                  </div>
                  <div className={styles['agreement']}>
                    <img src="src/assets/pacmen.png" alt="" />
                  </div>
                </div>
              </div>

              <div className={styles['right']}>
                <div className={styles['smile-hide'] +styleControl(styles['icon-show'])}>
                  <MyIcon className={styles['smile-icon']} type='icon-xiaolian' onClick={() => setMode('signUp')} />
                </div>
                <div className={styles['login-wrapper'] +styleControl(styles['login-wrapper-hidden'])}>
                  <div className={styles['title']}>邮箱登录</div>
                  <div className={styles['input-container']}>
                    <Form form={form} >
                      <FormItem name='email'
                        rules={[
                          {
                            validator: checkEmail

                          }
                        ]}>
                        <Input placeholder="输入邮箱账号" />
                      </FormItem>
                      <FormItem name='password'
                        rules={[
                          {
                            validator: checkPasswrod
                          }
                        ]}
                      >
                        <Input placeholder="输入密码" />
                      </FormItem>
                      <Button disabled={loginBtn} className={styles['button']} onClick={handleLogin} >登录</Button>
                    </Form>
                  </div>
                  <div className={styles['agreement']}>
                    <img src="src/assets/pacmen.png" alt="" />
                  </div>
                </div>
              </div>
            </Modal>
          )
          : null
      }

    </>
  );
};

export default Main;