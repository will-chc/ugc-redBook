import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:5000',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        // 其他自定义请求头
    }
});

// 请求拦截器
instance.interceptors.request.use(config => {
    // 可在此处对请求进行处理，如添加请求头、请求参数等
    // 在请求发送前添加 token
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    console.log(userId);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['userId'] = userId;
    }
    return config;
}, error => {
    // 对请求错误进行处理
    return Promise.reject(error);
});

// 响应拦截器
instance.interceptors.response.use(response => {
    // 对响应数据进行处理，如解析响应数据、处理错误信息等
    return response.data;
}, error => {
    // 对响应错误进行处理
    return Promise.reject(error);
});


const request = (url: string, data: any, method = 'GET') => {
    return new Promise((resolve, reject) => {
      switch (method.toUpperCase()) {
        case 'GET':
          instance.get(url, { params: { ...data } })
            .then(res => {
              resolve(res.data);
            })
            .catch(err => {
              reject(err);
            });
          break;
        case 'POST':
          instance.post(url, data)
            .then(res => {
              resolve(res.data);
            })
            .catch(err => {
              reject(err);
            });
          break;
        default:
          reject(new Error(`Invalid method: ${method}`));
          break;
      }
    });
  };
  

export default request;