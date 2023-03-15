import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.less"
import NoteItem from "../../components/NoteItem";
import { Modal, Form, Input, Button } from 'antd';
import NoteContent from "../../components/NoteContent";
import { MyIcon } from "../../Icon/MyIcon";
//reg
import { EmailReg, PasswordReg } from "../../utils/regex";
// context 
import { NoteContext } from "../../Context";
import request from "../../server/request";


interface noteCard {
  id: string,
  user_id: string,
  title: string,
  cover_image: string,
  liked:boolean,
  userInfo: {
    nickName: string,
    avatar: string
  }
}
const FormItem = Form.Item;

const H1 = 266, H2 = 150;

const Main: React.FC = () => {

  const topArr: number[] = [0, 0, 0, 0, 0];

  const [form] = Form.useForm();

  // state
  const [curData, setaCurData] = useState<noteCard>({
    id: '',
    user_id: '',
    title: '',
    cover_image: '',
    liked:false,
    userInfo: {
      nickName: '',
      avatar: ''
    }
  }); // 当前详情数据

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [arr, setArr] = useState<noteCard[]>([]);

  const [loginBtn, setLoginBtn] = useState(true);

  const [mode, setMode] = useState('signUp');

  const [isLogin, setILogin] = useState(Boolean(localStorage.getItem('token')));

  const [page, setPage] = useState(1);

  const [hasNextPage, setHasNextPage] = useState(true);

  const [column, setColumn] = useState(5);

  const [initLeft, setInitLeft] = useState(42);

  const pageRef = useRef<HTMLDivElement>(null);

  //context
  const NoteProvider = NoteContext.Provider;

  // window.addEventListener('resize', ()=> {

  //   if(window.innerWidth >= 1280) setColumn(5)
  //   if(window.innerWidth< 1280) setColumn(4);
  // });

  useEffect(() => {
    getInitData();
  }, []);

  useEffect(() => {
    // 监听滚动
    document.addEventListener('scroll', loadNext);
    return () => {
      document.removeEventListener("scroll", loadNext);
    }
  }, [arr]);


  // function

    // 获取初始化数据
  const getInitData = () => {
      // 请求数据
    request('/note_list', { page }).then((res: any) => {
      const { resultList, hasNextPage } = res;
      setArr(resultList);
      setHasNextPage(hasNextPage);
    });
  }

  const handleCancel = () => {
    setIsModalOpen(false);
    // 更新数据
  };

  // 滚动加载
  const loadNext = () => {
    if (!hasNextPage) return;
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    const scrollHeight = document.documentElement.scrollHeight;
    if (scrollTop + clientHeight + 600 >= scrollHeight) {
      // 请求数据
      request('/note_list', { page: page + 1 }).then((res: any) => {
        const { resultList, hasNextPage } = res;
        setHasNextPage(hasNextPage);
        const newArr = [...arr, ...resultList];
        setArr(newArr);
        setPage(page + 1);
      });
    }
  }

  //查看详细笔记
  const showDetail = (item: any) => {
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
    request('/login', { email, password }, 'post').then((res: any) => {
      const { token, user } = res;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.id);
      setILogin(true);
    })
  }

  //register
  const handleRegister = () => {
    const { getFieldsValue } = form;
    const { email, password } = getFieldsValue();
    request('/register', { email, password }, "post").then(res => {
      // 登录
      setMode('signUp');
    });
  }

  // style
  const styleControl = (str: string) => {
    if (mode == 'signIn') return " " + str;
    return "";
  }

  const getTop = (i: number, col: number, item: noteCard) => {
    const top = topArr[col];
    const img = new Image();
    img.src = item.cover_image;
    const aspectRatio = img.naturalWidth / img.naturalHeight;
    topArr[col] += (aspectRatio < 1 ? H1 : H2) + 100;
    return top;
  }



  return (
    <>
      <div className={styles['feeds-page']} ref={pageRef}>
        {arr.map((item, i) => {
          return <div style={{
            position: "absolute",
            top: getTop(Math.ceil((i + 1) / column), i % column, item) + 88,
            left: (i % column) * 240 + 42,
          }}
          key={item.id + Math.random()} 
          >
            <NoteItem key={item.id + Math.random()} item={item} showDetail={() => showDetail(item)} />
          </div>

        })}
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

              <NoteContent data={curData} />
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
                <div className={styles['register'] + styleControl(styles['register-show'])}>
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
                      <Button disabled={loginBtn} className={styles['button']} onClick={handleRegister} >注册账号</Button>
                    </Form>
                  </div>
                  <div className={styles['agreement']}>
                    <img src="src/assets/pacmen.png" alt="" />
                  </div>
                </div>
              </div>

              <div className={styles['right']}>
                <div className={styles['smile-hide'] + styleControl(styles['icon-show'])}>
                  <MyIcon className={styles['smile-icon']} type='icon-xiaolian' onClick={() => setMode('signUp')} />
                </div>
                <div className={styles['login-wrapper'] + styleControl(styles['login-wrapper-hidden'])}>
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