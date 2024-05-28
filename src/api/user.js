import request from "../utils/request.js";

export const userRegisterService = (registerData) => {
  const parmas = new URLSearchParams();
  for (let key in registerData) {
    parmas.append(key, registerData[key]);
  }
  return request.post("/user/register", parmas);
};

export const userLoginService = (loginData) => {
  const parmas = new URLSearchParams();
  for (let key in loginData) {
    parmas.append(key, loginData[key]);
  }
  return request.post("/user/login", parmas);
};

export const userInfoService = () => {
  return request.get("/user");
};

export const updateUserService = (userModel) => {
  return request.put("/user", userModel);
};

export const updateUserAvatarService = (avatarUrl) => {
  let params = new URLSearchParams();
  params.append("avatarUrl", avatarUrl);
  return request.patch("/user/avatar", params);
};

export const updateUserPwdService = (pwdModel) => {
  return request.patch("/user/pwd", pwdModel);
};
