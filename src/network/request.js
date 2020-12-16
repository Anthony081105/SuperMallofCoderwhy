import axios from 'axios'
// 使用前 要先安装 axios 
// npm install axios --save

// 法4
export function request(config) {
    // 1.创建axios的实例
    const instance = axios.create({
        baseURL: 'http://152.136.185.210:7878/api/m5',
        timeout: 5000
    })

    // 2.axios拦截器

    // 2.1 请求拦截
    // use中的两个参数为两个函数，分别对应成功和失败
    instance.interceptors.request.use(config=>{
        console.log(config);

        // 2.1请求拦截的作用
        // 1.比如拦截config中的一些不符合服务器要求的信息

        // 2.比如每次发送网络请求时，都虚妄在界面中显示一个请求的图标

        // 3.某些网络请求（比如登录（token）），必须携带一些特殊的信息

        // 拦截之后，需要返回，若不返回，则这次请求会失败
        return config
    },err=>{
        console.log(err);
    });


    // 2.2 响应拦截
    instance.interceptors.response.use(res=>{
        // console.log(res);
        return res.data
    },err=>{
        console.log(err);
    });
    
   
    // 3.// 发送真正的的网络请求
     // instance(config)实际是返回的就是一个Promise对象，因此这里的包装可以去掉
    return instance(config)
}