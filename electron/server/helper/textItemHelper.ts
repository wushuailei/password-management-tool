import { ipcMain } from "electron";
import { tableDB } from "../db/db.modules.ts";
import sm from "../../utils/sm.ts";

// 生成模糊查询条件
const generateSearchCondition = (params: any) => {
  const condition: any = {};
  Object.keys(params).forEach((key) => {
    if (key !== '_id' && key !== 'groupId' && params[key]) {
      condition[key] = { $regex: new RegExp(params[key]) };
    } else {
      condition[key] = params[key];
    }
  });
  return condition;
};

export default {
  // 查询文本项列表
  queryTextItemList: () => {
    ipcMain.on("queryTextItemList", async (event, arg) => {
      try {
        const params = JSON.parse(arg);
        const offset = (params.current - 1) * params.pageSize;
        const limit = params.pageSize;
        delete params.current;
        delete params.pageSize;
        const condition = generateSearchCondition(params);
        const countRes = await tableDB.count(condition)
        const dataRes = await tableDB.limit(offset, limit).sort({ createdAt: -1 }).find(condition)
        const data = dataRes.map((item: any) => {
          Object.keys(item).map((key) => {
            if (item[key].encrypt) {
              item[key] = sm.sm2Decrypt(item[key].val);
            }
          });
          return item
        });
        event.reply("queryTextItemList-reply", { code: 200, data: { list: data, count: countRes } });
      } catch (error) {
        event.reply("queryTextItemList-reply", {
          code: 400,
          msg: "查询失败",
        });
      }
    });
  },
  // 添加文本项
  addTextItem: () => {
    ipcMain.on("addTextItem", (event, arg) => {
      const { params, groupId } = JSON.parse(arg);
      const obj = <any>{
        groupId,
      };
      params.map((item: any) => {
        if (item.colType === "encryptText") {
          obj[item.key] = {
            val: sm.sm2Encrypt(item.val),
            encrypt: true,
          };
        } else {
          obj[item.key] = item.val || "";
        }
      });
      tableDB.insert(obj).then(
        (res: any) => {
          event.reply("addTextItem-reply", { code: 200, data: res });
        },
        () => {
          event.reply("addTextItem-reply", { code: 400, msg: "添加失败" });
        }
      );
    });
  },
  // 编辑文本项
  editTextItem: () => {
    ipcMain.on("editTextItem", (event, arg) => {
      const { params, groupId, _id } = JSON.parse(arg);
      const obj = <any>{
        groupId,
      };
      params.map((item: any) => {
        if (item.colType === "encryptText") {
          obj[item.key] = {
            val: sm.sm2Encrypt(item.val),
            encrypt: true,
          };
        } else {
          obj[item.key] = item.val || "";
        }
      });
      tableDB.update({ _id }, obj).then(
        (res: any) => {
          event.reply("editTextItem-reply", { code: 200, data: res });
        },
        () => {
          event.reply("editTextItem-reply", { code: 400, msg: "编辑失败" });
        }
      );
    });
  },
  // 删除文本项
  delTextItem: () => {
    ipcMain.on("delTextItem", (event, arg) => {
      const params = JSON.parse(arg);
      tableDB.remove({ _id: params._id }).then(
        (res: any) => {
          event.reply("delTextItem-reply", { code: 200, data: res });
        },
        () => {
          event.reply("delTextItem-reply", { code: 400, msg: "删除失败" });
        }
      );
    });
  },
};
