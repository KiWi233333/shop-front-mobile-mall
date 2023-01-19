import request from "@/util/request";

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
 * @修改密码
 */
// 忘记密码：发送验证码 phone
export function getUpdatePwdCode(phone) {
  return request({
    method: "get",
    url: "/users/codePassword",
    params: {
      phone,
    },
  });
}
// 验证验证码
/**
 *
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
// 修改密码 phone newPassword
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
