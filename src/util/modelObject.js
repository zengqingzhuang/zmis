/**
 * @file modelObject.js
 * @author zengqingzhuang(zengqingzhuang@baidu.com)
 * @description 操作数据源公共方法
 * @since 2018/02/02
 */
import _ from 'lodash';
import moment from 'moment';
import executeExpress from './express';
/**
 * 获取元素结果值
 *
 * @param {Object} model - 数据源
 * @param {string} schema - 节点配置信息
 * @return {string | number}
 */
export function getElValue(model, schema) {
    // 优先按公式计算值
    if (schema && schema.valueTemplate) {
        return executeExpress(schema.valueTemplate, model);
    }
    // 未设置默认值，必须返回null，用于让各个组件的value取默认值.
    return model[schema.name];
}
/**
 * 修改URL参数
 *
 * @param {string} destiny 页面地址
 * @return {string | number}
 */
export function changeURLPar(destiny, par, parValue) {
    let pattern = par + '=([^&]*)';
    let replaceText = par + '=' + parValue;
    let url = '';
    if (destiny.match(pattern)) {
        let tmp = '/('+ par + '=)([^&]*)/gi';
        url = destiny.replace(eval(tmp), replaceText);
    } else if (destiny.match('[\?]')) {
        url = destiny + '&' + replaceText;
    } else {
        url = destiny + '?' + replaceText;
    }
    history.pushState({}, '', url);
}
