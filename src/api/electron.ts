import request from './request.ts'

/**
 * @function clipboardText 复制到剪切板
 */
export function clipboardText (text: string) {
    return request('clipboard-text', { text })
}