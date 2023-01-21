import { request } from "@/util/request";

// --------------用户注册、登录---------------
/**
 *  用户注册
 *@userInfo  {
   username: "tom",
   phone: "134150000001",
   password: "pariatur",
   code: "232332",
 };
 **/
export function register(userInfo) {
  return request({
    method: "post",
    url: "/users/register",
    data: userInfo,
  });
}
// 用户注册-获取短信验证码 phone
export function getRegisterCode(phone) {
  return request({
    method: "get",
    url: "/users/register/code",
    params: {
      phone,
    },
  });
}
/**
 *  用户登录
 *@userInfo {
   "phone": ,/ username
   "code": ,/"password"
   "loginType": 1(验证码) 0(用户名密码)
  }
 **/
export function loginByCode(userInfo) {
  return request({
    method: "post",
    url: "/users/login",
    data: {
      ...userInfo,
      loginType: 1,
    },
  });
}
// 用户登录-密码
export function loginByPwd(userInfo) {
  return request({
    method: "post",
    url: "/users/login",
    data: {
      ...userInfo,
      loginType: 0,
    },
  });
}
// 用户登录-获取短信验证码
export function getLoginCode(phone) {
  return request({
    method: "get",
    url: "/users/code",
    params: {
      phone,
    },
  });
}
// 用户验证-查询个人用户
export function checkUser(token) {
  return request({
    method: "get",
    url: "/users/me",
    headers: {
      Authorization: token,
    },
  });
}

/**
 * 忘记密码：发送验证码 phone
 * @修改密码
 */
export function getUpdatePwdCode(phone) {
  return request({
    method: "get",
    url: "/users/codePassword",
    params: {
      phone,
    },
  });
}

/**
 *  验证验证码
 * @param {*} userInfo{phone&code}
 * @returns
 */
export function checkUpdatePwdCode(userInfo) {
  const { phone, code } = userInfo;
  return request({
    method: "get",
    url: "/users/check/codePassword",
    params: {
      phone,
      code,
    },
  });
}
// 忘记密码 phone newPassword
export function updatePwd(userInfo) {
  const { phone, newPassword } = userInfo;
  return request({
    method: "put",
    url: "/users/updatePassword",
    data: {
      phone,
      newPassword,
    },
  });
}

// --------------------修改用户-------------------
/**
 * 上传用户头像
 * @param {file:icon} fromData
 * @returns res
 */
export function setUserIcon(fromData) {
  return request({
    method: "put",
    url: "/users/updatePassword",
    data: fromData,
  });
}
/**
 * 修改用户头像地址
 * @param {地址:string} icon
 * @param {登录token:string} token
 * @returns
 */
export function updateUserIcon(icon, token) {
  return request({
    method: "put",
    url: "/users/updateIcon",
    headers: {
      Authorization: token,
    },
    data: {
      icon,
    },
  });
}

/**
 *
 * @param {昵称:string} nickName
 * @param {string} token
 * @returns
 */
export function updateUserNickName(nickName, token) {
  return request({
    method: "put",
    url: "/users/updateNickName",
    headers: {
      Authorization: token,
    },
    data: {
      nickName,
    },
  });
}

/**
 * 获取钱包信息
 * @param {*} token
 * @returns
 */
export function getPurseInfo(token) {
  return request({
    method: "get",
    url: "/account/query",
    headers: {
      Authorization: token,
    },
  });
}
