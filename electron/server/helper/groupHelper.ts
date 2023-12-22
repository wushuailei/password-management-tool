import { ipcMain } from "electron";
import { groupDB } from "../db/db.modules.ts";

export default {
  // 查询组列表
  queryGroup: () => {
    ipcMain.on("queryGroup", (event) => {
      groupDB.sort({ createdAt: 1 }).find().then(
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
      const params = JSON.parse(arg);
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
  // 编辑组
  editGroup: () => {
    ipcMain.on("editGroup", (event, arg) => {
      const params = JSON.parse(arg);
      groupDB.update({ _id: params._id }, params).then(
        (res: any) => {
          event.reply("editGroup-reply", { code: 200, data: res });
        },
        () => {
          event.reply("editGroup-reply", { code: 400, msg: "编辑失败" });
        }
      );
    });
  },
  // 删除组
  delGroup: () => {
    ipcMain.on("delGroup", (event, arg) => {
      const params = JSON.parse(arg);
      groupDB.remove({ _id: params._id }).then(
        (res: any) => {
          event.reply("delGroup-reply", { code: 200, data: res });
        },
        () => {
          event.reply("delGroup-reply", { code: 400, msg: "删除失败" });
        }
      );
    });
  },
};
