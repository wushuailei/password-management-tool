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
/**
 * @function editGroup 编辑组
 */
export function editGroup (params: object) {
    return request('editGroup', params)
}
/**
 * @function delGroup 删除组
 */
export function delGroup (params: object) {
    return request('delGroup', params)
}