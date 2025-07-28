import * as dd from 'dingtalk-jsapi'
import router from '../router'
import axios from 'axios'
import jwt_decode from 'jwt-decode';


// 定义了一个常量 postUrlV1，用于存储后端服务器的请求路径    https://api-v2.sensor-smart.cn:29028/ddinguic/index.html
const systemConfigure = {
  // isDebugMode: true,
  isDebugMode: false,
  // serverrUrl: "https://api-v1.sensor-smart.cn:28023",
  serverr802: "https://api-v2.sensor-smart.cn:22027/ding/pack",
  // serverrUrl: "https://api-v2.sensor-smart.cn:29028/ss-proxy/p29001"
  serverrUrl: "https://api-v2.sensor-smart.cn:22027/ss-proxy/p35001"
}


// 设置 Axios 库的默认请求基础路径为 "/ding"，这意味着所有的请求会发送到以 "/ding" 开头的路径下
// axios.defaults.baseURL = "/ding"
// axios.defaults.baseURL = "/"
const baseURL = process.env.VUE_APP_API_URL || '/ding/pack';

// 定义了两个常量，分别用于存储钉钉用户令牌和时间戳在本地存储中的键名。
export const key_DingTokenJWT = "sensor_DingTokenJWT"
const key_DingTokenTS = "sensor_DingTokenTS"
export const key_DingName = "sensor_DingName"
export const key_DingUserIndex = "key_DingUserIndex"
export const key_DingUserPhone = "key_DingUserPhone"
export const key_DingScannedResult = "key_DingScannedResult"
export const key_DingResponseStored = "key_DingResponseStored"
export const key_DingResponseUsed = "key_DingResponseUsed"

// 定义全局变量
export let cachedProductId = '晟思'; // 默认值
export let cachedProductPerson = '晟思'; // 默认值
export let cachedPersonIndex = 333; // 默认值
export let cachedResponseUsed = "未领用1"; // 默认值
export let cachedResponseStored = "未入库1"; // 默认值

export function updateCachedProductId(newId) {
  cachedProductId = newId;
}

export function updateCachedProductPerson(newPerson) {
  cachedProductPerson = newPerson;
}

export function updateCachedPersonIndex(personIndex) {
  cachedPersonIndex = personIndex;
}
export function updateCachedResponseStored(responseStored) {
  cachedResponseStored = responseStored;
  console.log("cachedResponseStored 是： ",cachedResponseStored)
}
export function updateCachedResponseUsed(responseUsed) {
  cachedResponseUsed = responseUsed;
  console.log("cachedResponseUsed 是： ",cachedResponseUsed)
}



// 定义了两个变量，分别用于存储请求ID和目标URL，默认值分别为1和null。
let reqID = 1
let urlTarget = null

// 生成请求ID ,每次调用会使请求ID递增
function getReqID() {
  reqID = reqID + 1
  return reqID
}

// 设置和获取目标URL
export function setUrlTarget(uuri) {
  urlTarget = uuri
}

export function getUrlTarget() {
  return urlTarget
}


// 钉钉免登-发送POST请求
export function PostData(method, data, callSuccess, callFail) {
  let userToken = localStorage.getItem(key_DingTokenJWT)
  if (!userToken) {
    userToken = ""
  }
  let postPack = {
    reqID: getReqID(),
    method: method,
    sender: "",
    sendee: "",
    token: userToken,
    reqData: data
  }

  // let urlSend = "/pack" //systemConfigure.serverrUrl + postURL    systemConfigure.serverr802
  // let urlSend = systemConfigure.serverrUrl

  axios.post(baseURL, JSON.stringify(postPack), {
    headers: {
      "content-type": "application/json"
    }
  })
    .then(function (response) {
      if (systemConfigure.isDebugMode) {
        alert('PostData_response: ' + JSON.stringify(response.data)); // 弹出日志;
      }
      if (response.data.result == 1) {
        callSuccess(response.data.respData)
      } else if (callFail) {
        console.log(response.data);
        callFail(response.data.msg)
      }
    })
    .catch(function (error) {
      if (systemConfigure.isDebugMode) {
        alert('PostData_response: ' + JSON.stringify(error)); // 弹出日志;
      }
      if (callFail) {
        callFail(error)
      }
    });
}

// 向后端发送POST请求
export function PostDataUrl(postUrlName, data, isJson, callSuccess, callFail) {
  let userToken = localStorage.getItem(key_DingTokenJWT)
  if (!userToken) {
    userToken = ""
  }
  let postPack = {
    reqID: getReqID(),
    method: postUrlName,
    sender: "",
    sendee: "",
    token: userToken,
    reqData: data
  }
  let dataType = ""
  if (isJson) {
    dataType = "application/json"
  } else {
    dataType = "multipart/form-data"
  }
  // let urlSend = "/pack" //systemConfigure.serverrUrl + postURL
  // let urlSend = systemConfigure.serverrUrl

  // let urlSend = "/"+postUrlName;
  // let urlSend = postUrlName;

  let postJson = JSON.stringify(postPack)
  // if (systemConfigure.isDebugMode) {
  //   alert('urlSend: ' + urlSend);
  //   alert('postJson: ' + postJson);
  // }

  //    axios.post(urlSend, postJson, {
  axios.post(baseURL, postJson, {
    headers: {
      "content-type": dataType
    }
  })
    .then(function (response) {
      if (systemConfigure.isDebugMode) {
        alert('responseJson: ' + JSON.stringify(response.data));
      }
      if (response.data.result == 1) {
        // alert('responseJson  1 : ' + JSON.stringify(response.data.respData));
        // alert('responseJson  2: ' + JSON.stringify(response.data.msg));
        console.log('responseJson  1 : ' + JSON.stringify(response.data.respData));
        callSuccess(response.data.respData)

      } else if (callFail) {
        console.log(response.data);
        callFail(response.data.msg)
      }
    })
    .catch(function (error) {
      console.log(error);
      if (callFail) {
        callFail(error)
      }
    });
}


// 用于获取钉钉授权码
export function GetDingCode(callSuccess, callFail) {
  const corpId = 'ding103faa9c7d30c144' //晟思 - 钉钉企业id
  // const corpId = 'ding1fa39ac9b223238435c2f4657eb6378f' //山西 - 钉钉企业id  ding1fa39ac9b223238435c2f4657eb6378f
  if (dd.env.platform !== 'notInDingTalk') {
    dd.ready(() => {
      dd.runtime.permission.requestAuthCode({
        corpId: corpId,
        onSuccess: (info) => {
          callSuccess(info.code)
        },
        onFail: (err) => {
          callFail(JSON.stringify(err))
        }
      })
    })
  } else {
    //callFail("notInDingTalk")
    router.push({path: '/sensor_ddingWork/Debug/login'})
  }
}

// 获取当前时间的时间戳（单位：秒）
export function GetTSSecond() {
  return parseInt(new Date().getTime() / 1000);
}

// 用于设置新的用户令牌
export function setNewToken(newToken) {
  let tsNow = GetTSSecond()
  localStorage.setItem(key_DingTokenTS, tsNow)
  localStorage.setItem(key_DingTokenJWT, newToken)
}


// 用于获取钉钉用户令牌
export function GetDingUserToken(callSuccess, callFail) {
  // 第一次登录时
  let userToken = localStorage.getItem(key_DingTokenJWT)
  // alert(userToken)
  // alert(userToken)
  // let decodedToken = jwt.decode(userToken);
  // let name = decodedToken.userName;
  // let userIndex = decodedToken.userIndex;
  // localStorage.setItem(key_DingName, name);
  // localStorage.setItem(key_DingUserIndex, userIndex);
  // alert("name"+name)
  // alert("userIndex"+userIndex)

  if (userToken) {
    let tokenTS = localStorage.getItem(key_DingTokenTS)
    if (tokenTS) {
      let tsLast = parseInt(tokenTS)
      let tsNow = GetTSSecond()
      if (tsNow - tsLast < 1) {
        // Token 在有效期内，直接从缓存中获取用户信息
        // alert("11111")
        let name = localStorage.getItem(key_DingName);
        let userIndex = localStorage.getItem(key_DingUserIndex);
        console.info(name, userIndex)
        callSuccess(userToken)
        return
      }
    }
  }
  // Token 过期或者没有缓存中的用户信息，重新获取 Token
  GetDingCode(
    (code) => { // Ding_LoginByCode   Dajun_LoginByCode
      PostData("Ding_LoginByCode", code, (newToken) => {
        // alert("22222")
        let decodedToken = jwt_decode(newToken);
        // console.log(decodedToken);
        // alert(decodedToken)
        let name = decodedToken.userName;
        let userPhone = decodedToken.userPhone;
        let userIndex = decodedToken.userID;
        // alert("姓名"+name + "用户Index"+userIndex + "电话"+userPhone)
        // 将用户信息放入缓存
        localStorage.setItem(key_DingName, name);
        localStorage.setItem(key_DingUserIndex, userIndex);
        localStorage.setItem(key_DingUserPhone, userPhone);

        // 更新 Token 和 Token 时间戳
        setNewToken(newToken)
        callSuccess(newToken)
      }, callFail)
    },
    (err) => {
      console.log(err, 456)
      if (callFail) {
        callFail(err)
      }
    })
}


// 用于获取文件下载令牌
export function GetFileDownloadToken(fileHash, callSuccess, callFail) {
  PostData("Ding_GenrateDownloadUrlOnce", fileHash, (newToken) => {
    callSuccess(newToken)
  }, callFail)
}

export default systemConfigure;
