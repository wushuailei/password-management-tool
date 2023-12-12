const Datastore = require("nedb");
import { app as electronApp } from "electron";
import path from "node:path";

class DB {
  db: any;
  offset: number | undefined;
  size: number | undefined;
  orderby: any;
  constructor(database: string, options = {}) {
    let dbPath = "";
    if (process.env.NODE_ENV === "development") {
      dbPath = path.dirname(__dirname);
    } else {
      dbPath = electronApp.getPath("exe");
    }
    this.db = new Datastore({
      filename: path.join(dbPath, `/nedb/${database}Ds.db`),
      autoload: true,
      ...options,
    });
  }
  limit(offset: number, limit: number) {
    this.offset = offset || 0;
    this.size = limit || 15;
    return this;
  }
  sort(orderby: any) {
    this.orderby = orderby;
    return this;
  }
  /**
   * query: Object类型  查询条件 支持使用比较运算符($lt, $lte, $gt, $gte, $in, $nin, $ne), 逻辑运算符
   * offset: 偏移量 忽略多少条  用于分页
   * limit: 返回条数  用于分页
   * 返回: docs 数组  返回查询到的数据
   * * */
  find(query: any = undefined, select: any = undefined) {
    return new Promise((resolve, reject) => {
      let stmt = this.db.find(query || {});
      if (this.orderby !== undefined) {
        stmt.sort(this.orderby);
      }
      if (this.offset !== undefined) {
        stmt.skip(this.offset).limit(this.size);
      }
      if (select != undefined) {
        stmt.projection(select || {});
      }
      stmt.exec((err: any, docs: any) => {
        if (err) {
          return reject(err);
        }
        resolve(docs);
      });
    });
  }
  /**
   * query: object  查询条件
   * 查找一条
   * 返回: 查到数据
   * * */
  findOne(query: any, select: any = undefined) {
    return new Promise((resolve, reject) => {
      let stmt = this.db.findOne(query || {});
      if (this.sort !== undefined) {
        stmt.sort(this.sort);
      }
      if (select != undefined) {
        stmt.projection(select || {});
      }
      stmt.exec((err: any, doc: any) => {
        if (err) {
          return reject(err);
        }
        resolve(doc);
      });
    });
  }
  /**
   * 插入数据
   * value: 插入的数据
   * 使用array，实现批量插入。一旦其中一个操作失败，所有改变将会回滚。
   * * */
  insert(values: any) {
    return new Promise((resolve, reject) => {
      this.db.insert(values, (err: any, newDoc: any) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        resolve(newDoc);
      });
    });
  }
  /**
   * 更新数据
   * query: object  查询的数据
   * values: 更新的数据
   * options : object  muti(默认false)，是否允许修改多条文档；upsert(默认为false)
   * * */
  update(query: any, values: any, options: any = undefined) {
    return new Promise((resolve, reject) => {
      this.db.update(
        query || {},
        values || {},
        options || {},
        (err: any, numAffected: any) => {
          if (err) {
            return reject(err);
          }
          resolve(numAffected);
        }
      );
    });
  }
  /**
   * 根据options配置删除所有query匹配到的文档集。
   * query: 与find和findOne中query参数的用法一致
   * options: 只有一个可用。muti(默认false)，允许删除多个文档
   * * */
  remove(query: any, options: any = undefined) {
    return new Promise((resolve, reject) => {
      this.db.remove(
        query || {},
        options || {},
        (err: any, numAffected: any) => {
          if (err) {
            return reject(err);
          }
          resolve(numAffected);
        }
      );
    });
  }
}

export default DB;
