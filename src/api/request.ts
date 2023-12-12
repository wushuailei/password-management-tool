import { MessagePlugin } from 'tdesign-vue-next';

export default function (url: string, data: any = {}) {
  window.ipcRenderer.send(url, JSON.stringify(data));
  return new Promise((resolve, reject) => {
    window.ipcRenderer.once(`${url}-reply`, (_event, arg) => {
      if (arg.code === 200) {
        resolve(arg);
      } else {
        MessagePlugin.error(arg.msg);
        reject(arg);
      }
    });
  });
}
