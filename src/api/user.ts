import request from './request.ts'

/**
 * @function queryUserInfo 查询用户信息
 * @param _id 用户id
 */
export function queryUserInfo (_id: string) {
    return request('queryUserInfo', { _id })
}
/**
 * @function updateUserInfo 更新用户信息
 */
export function updateUserInfo (params: object) {
    return request('updateUserInfo', params)
}
/**
 * @function checkUserExist 校验用户是否存在
 */
export function checkUserExist () {
    return request('checkUserExist')
}
/**
 * @function login 登录
 */
export function login (params: object) {
    return request('login', params)
}