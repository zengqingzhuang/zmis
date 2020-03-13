/**
 * @file executeExpress.js
 * @author zengqingzhuang(zengqingzhuang@baidu.com)
 * @description 执行表达式方法
 * @since 2018/01/10
 */
import _ from 'lodash';
import flat from 'flat';
import moment from 'moment';
export default (express, data) => {
    try {
        data = flat.unflatten(data);
        let value = null;
        if (express.trim().startsWith('data.')) {
            value = new Function(`var data = arguments[0]; return ${express};`)(data);
        } else {
            const prefix = 'return ';
            if (!express.includes('return ')) {
                express = prefix + express;
            }
            value = _.template('<%' +  express + '%>', {imports: {moment}})(data);
        }
        if (value !== undefined) {
            return value;
        }
        return null;
    } catch (e) {
        return null;
    }
};