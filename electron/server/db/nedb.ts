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
      dbPath = electronApp.getPath("userData");
    }
    this.db = new Datastore({
      filename: path.join(dbPath, `/nedb/${database}Ds.db`),
      autoload: true,
      timestampData: true,
      ...options,
    });
  }
  /**
   * @function limit 分页 一般在查询之前使用
   * @param { Number } offset 偏移量
   * @param { Number } limit 查询条数
   * @returns this
   */
  limit(offset: number, limit: number) {
    this.offset = offset || 0;
    this.size = limit || 15;
    return this;
  }
  /**
   * @function sort 分页 一般在查询之前使用
   * @param { Object } orderby 分页条件
   * @returns this
   */
  sort(orderby: any) {
    this.orderby = orderby;
    return this;
  }
  /**
   * @function find 查询
   * @param { Object } query 查询条件 支持使用比较运算符($lt, $lte, $gt, $gte, $in, $nin, $ne), 逻辑运算符
   * @returns { Promise } docs 数组 查询到的数据
   */
  find(query: any = undefined): Promise<any> {
    return new Promise((resolve, reject) => {
      let stmt = this.db.find(query || {});
      if (this.orderby !== undefined) {
        stmt.sort(this.orderby);
      }
      if (this.offset !== undefined) {
        stmt.skip(this.offset).limit(this.size);
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
   * @function findOne 查询单条
   * @param { Object } query 查询条件
   * @returns { Promise } 查到数据
   */
  findOne(query: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let stmt = this.db.findOne(query || {});
      if (this.sort !== undefined) {
        stmt.sort(this.sort);
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
   * @function insert 插入数据
   * @param { Object } values 需要插入的内容
   * @returns { Promise } 插入结果
   */
  insert(values: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.insert(values, (err: any, newDoc: any) => {
        if (err) {
          return reject(err);
        }
        resolve(newDoc);
      });
    });
  }
  /**
   * @function update 更新数据
   * @param { Object } query 查询条件 根据该条件修改相应数据
   * @param { Object } values 更新的数据
   * @param { Object } options muti (默认false)，是否允许修改多条文档；upsert(默认为false)
   * @returns { Promise } 更新结果
   */
  update(query: any, values: any, options: any = undefined): Promise<any> {
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
  /**
   * @function remove 删除数据
   * @param { Object } query 查询条件 根据该条件删除相应数据
   * @param { Object } options 只有一个可用。muti(默认false)，允许删除多个文档
   * @returns { Promise } 删除结果
   */
  remove(query: any, options: any = undefined): Promise<any> {
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
  /**
   * @function count 查询总条数
   * @param { Object } query 查询条件 根据查询条件查询总条数
   */
  count (query: any = {}) {
    return new Promise((resolve, reject) => {
      this.db.count(query, (err: any, count: any) => {
        if (err) {
          return reject(err);
        }
        resolve(count);
      });
    });
  }
}

export default DB;
