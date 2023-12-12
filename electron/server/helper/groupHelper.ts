import { ipcMain } from "electron";
import { groupDB } from "../db/db.modules.ts";

export default {
  // 查询组列表
  queryGroup: () => {
    ipcMain.on("queryGroup", (event) => {
      groupDB.find().then(
        (res: any) => {
          event.reply("queryGroup-reply", { code: 200, data: res });
        },
        () => {
          event.reply("queryGroup-reply", { code: 400, msg: "查询失败" });
        }
      );
    });
  },
  // 添加组
  addGroup: () => {
    ipcMain.on("addGroup", (event, arg) => {
      const params = JSON.parse(arg)
      groupDB.insert(params).then(
        (res: any) => {
          event.reply("addGroup-reply", { code: 200, data: res });
        },
        () => {
          event.reply("addGroup-reply", { code: 400, msg: "添加失败" });
        }
      );
    });
  },
};
