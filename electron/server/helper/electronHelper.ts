import { ipcMain, clipboard } from "electron";

export default {
  // 复制到剪切板
  electronClipboard: () => {
    ipcMain.on("clipboard-text", (event, arg) => {
      try {
        const params = JSON.parse(arg);
        clipboard.writeText(params.text);
        event.reply("clipboard-text-reply", { code: 200, msg: "复制成功" });
      } catch (error) {
        event.reply("clipboard-text-reply", { code: 400, msg: "复制失败" });
      }
    });
  }
};
