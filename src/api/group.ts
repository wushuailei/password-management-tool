import request from './request.ts'

/**
 * @function queryGroupList 查询组列表
 */
export function queryGroupList () {
    return request('queryGroup')
}
/**
 * @function addGroup 添加组
 */
export function addGroup (params: object) {
    return request('addGroup', params)
}