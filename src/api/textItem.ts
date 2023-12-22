import request from './request.ts'

/**
 * @function queryTextItemList 查询文本项列表
 */
export function queryTextItemList (params: object) {
    return request('queryTextItemList', params)
}
/**
 * @function addTextItem 添加文本项
 */
export function addTextItem (params: object) {
    return request('addTextItem', params)
}
/**
 * @function editTextItem 编辑文本项
 */
export function editTextItem (params: object) {
    return request('editTextItem', params)
}
/**
 * @function delTextItem 删除文本项
 */
export function delTextItem (params: object) {
    return request('delTextItem', params)
}