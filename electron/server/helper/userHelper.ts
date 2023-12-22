import { ipcMain } from "electron";
import { userDB } from "../db/db.modules.ts";
import sm from "../../utils/sm.ts";

export default {
  // 查询用户
  queryUserInfo: () => {
    ipcMain.on("queryUserInfo", (event, arg) => {
      const { _id } = JSON.parse(arg);
      if (!_id) { return event.reply("queryUserInfo-reply", { code: 400, msg: "查询失败" }); }
      userDB.findOne({ _id }).then(
          (res: any) => {
            event.reply("queryUserInfo-reply", { code: 200, data: res });
          },
          () => {
            event.reply("queryUserInfo-reply", { code: 400, msg: "查询失败" });
          }
        );
    });
  },
  // 更新用户信息
  updateUserInfo: () => {
    ipcMain.on("updateUserInfo", (event, arg) => {
      const params = JSON.parse(arg);
      if (!params._id) { return event.reply("updateUserInfo-reply", { code: 400, msg: "更新失败" }); }
      userDB.update({ _id: params._id }, { ...params, password: sm.sm3Encrypt(params.password) }).then(
        (res: any) => {
          event.reply("updateUserInfo-reply", { code: 200, data: res });
        },
        () => {
          event.reply("updateUserInfo-reply", { code: 400, msg: "更新失败" });
        }
      );
    });
  },
  // 校验是否存在用户
  checkUserExist: () => {
    ipcMain.on("checkUserExist", (event) => {
      userDB.find().then(
        (res: any) => {
          event.reply("checkUserExist-reply", {
            code: 200,
            data: Boolean(res.length),
          });
        },
        () => {
          event.reply("checkUserExist-reply", { code: 400, msg: "校验失败" });
        }
      );
    });
  },
  // 登录
  login: () => {
    ipcMain.on("login", async (event, arg) => {
      try {
        const params = JSON.parse(arg);
        const countRes = await userDB.count();
        if (!countRes) {
          if (params.username === "admin" && params.password === "123456") {
            const res = await userDB.insert({
              username: params.username,
              password: sm.sm3Encrypt(params.password),
            });
            return event.reply("login-reply", { code: 200, data: res });
          }
        } else {
          const userInfo = await userDB.findOne({
            username: params.username,
            password: sm.sm3Encrypt(params.password),
          });
          if (userInfo) {
            return event.reply("login-reply", { code: 200, data: userInfo });
          }
        }
        return event.reply("login-reply", { code: 400, msg: "账号或密码错误" });
      } catch (error) {
        return event.reply("login-reply", { code: 400, msg: "登录失败" });
      }
    });
  },
};
