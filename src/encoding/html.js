/**
 * @file html.js
 * @author zengqingzhuang(zengqingzhuang@baidu.com)
 * @description html标签编码,解码
 * @since 2017/09/27
 */

/**
 * html标签编码
 *
 * @param {string} str - html标记参数传入
 * @return {string} 转义字符
 */
export function htmlEncode(str) {

    if (str.length === 0) {
        return '';
    }

    let tmpStr = str.replace(/&/g, '&gt;');
    tmpStr = tmpStr.replace(/</g, '&lt;');
    tmpStr = tmpStr.replace(/>/g, '&gt;');
    tmpStr = tmpStr.replace(/ /g, '&nbsp;');
    tmpStr = tmpStr.replace(/\'/g, '&#39;');
    tmpStr = tmpStr.replace(/\'/g, '&quot;');
    tmpStr = tmpStr.replace(/\n/g, '<br>');
    return tmpStr;
}

/**
 * html标签解码
 *
 * @param {string} str - html标签转义字符
 * @return {string} html标签
 */
export function htmlDecode(str)
{

    if (str.length === 0) {
        return '';
    }

    let tmpStr = str.replace(/&gt;/g, '&');
    tmpStr = tmpStr.replace(/&lt;/g, '<');
    tmpStr = tmpStr.replace(/&gt;/g, '>');
    tmpStr = tmpStr.replace(/&nbsp;/g, ' ');
    tmpStr = tmpStr.replace(/&#39;/g, '\'');
    tmpStr = tmpStr.replace(/&quot;/g, '\'');
    tmpStr = tmpStr.replace(/<br>/g, '\n');
    return tmpStr;
}