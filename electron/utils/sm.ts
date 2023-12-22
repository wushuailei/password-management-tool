const { sm2, sm3 } = require("sm-crypto");
import { app as electronApp } from "electron";
import fs from "node:fs";
import path from "node:path";

// 获取秘钥存储路径
function getKeyPath() {
  let keyPath = "";
  if (process.env.NODE_ENV === "development") {
    keyPath = path.dirname(__dirname);
  } else {
    keyPath = electronApp.getPath("userData");
  }
  return path.join(keyPath, `/sm`);
}

class SM {
  publickey!: string;
  privatekey!: string;
  constructor() {}
  // 生成密钥对
  generateKeyPair() {
    const keyPath = getKeyPath();
    let smFiles = [];
    try {
      smFiles = fs.readdirSync(keyPath);
    } catch (err) {
      fs.mkdirSync(keyPath);
      smFiles = fs.readdirSync(keyPath);
    }
    if (smFiles.length === 0) {
      const keyPair = sm2.generateKeyPairHex();
      fs.writeFileSync(
        path.join(keyPath, `/keyPair.json`),
        JSON.stringify(keyPair)
      );
    }
    this.getKeyPair();
  }
  // 获取秘钥对 并赋值
  getKeyPair() {
    const keyPath = getKeyPath();
    const keyPair = JSON.parse(
      fs.readFileSync(path.join(keyPath, `/keyPair.json`), "utf-8")
    );
    this.publickey = keyPair.publicKey;
    this.privatekey = keyPair.privateKey;
  }
  // sm2加密
  sm2Encrypt(data: string) {
    return sm2.doEncrypt(data, this.publickey);
  }
  // sm2解密
  sm2Decrypt(data: string) {
    return sm2.doDecrypt(data, this.privatekey);
  }
  // sm3加密
  sm3Encrypt(data: string) {
    return sm3(data, { key: this.publickey + this.privatekey });
  }
  // sm3验证
  sm3Verify(data: string, hash: string) {
    return this.sm3Encrypt(data) === hash;
  }
}

export default new SM();
