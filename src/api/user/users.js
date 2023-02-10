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
/**
 * 用户登录-密码
 * @param {*} username
 * @param {*} password
 * @param {*} loginType 到来类型默认0
 * @returns
 */
export function loginByPwd(username, password, loginType = 0) {
  return request({
    method: "post",
    url: "/users/login",
    data: {
      username,
      password,
      loginType,
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
 * @param {登录token:string} token
 * @returns res
 */
export function postUserIcon(fromData, token) {
  return request({
    method: "post",
    url: "/users/uploadIcon",
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: token,
    },
    data: fromData,
    timeout: 10000,
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
    data: { icon },
  });
}

/**
 *  修改昵称
 * @param {string} nickName 昵称
 * @param {string} token
 * @returns
 */
export function updateNickName(nickname, token) {
  return request({
    method: "put",
    url: "/users/updateNickName",
    headers: {
      Authorization: token,
    },
    data: { nickname },
  });
}

/**
 *  修改用户名
 * @param {string} username 用户名
 * @param {string} token
 * @returns
 */
export function updateUserName(username, token) {
  return request({
    method: "put",
    url: "/users/updateUsername",
    headers: { Authorization: token },
    data: { username },
  });
}
/**
 * 验证用户是否更换账号username
 * @param {*} token
 * @returns
 */
export function getIsNotUpdateUsername(token) {
  return request({
    method: "get",
    url: "/uses/isNotUpdateUsername",
    headers: { Authorization: token },
  });
}

/**
 *  修改手机号byCode
 * @param {string} phone 电话
 * @param {string} code 验证码
 * @param {string} token
 * @returns
 */
export function updatePhone(phone, code, token) {
  return request({
    method: "put",
    url: `/users/updatePhone/${phone}/${code}`,
    headers: {
      Authorization: token,
    },
    data: { phone },
  });
}
/**
 *  获取验证码（修改手机号）
 * @param {string} phone 电话
 * @param {string} token
 * @returns
 */
export function getUpdateCode(phone, token) {
  return request({
    method: "get",
    url: "/users/codePhone",
    headers: {
      Authorization: token,
    },
    params: { phone },
  });
}

/**
 * 修改密码（新旧）
 * @param {*} newPassword
 * @param {*} oldPassword
 * @param {*} token
 * @returns
 */
export function changeUserPwd(newPassword, oldPassword, token) {
  return request({
    method: "put",
    url: "/users/setPassword",
    headers: {
      Authorization: token,
    },
    data: { newPassword, oldPassword },
  });
}
