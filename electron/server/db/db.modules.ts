import DataSource from './nedb.ts'

// 创建用户数据源 并导出
export const userDB = new DataSource('user')

// 创建组数据源 并导出
export const groupDB = new DataSource('group')

// 创建表数据源 并导出
export const tableDB = new DataSource('table')
