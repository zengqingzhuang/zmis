/**
 * @file tplMethods.vue
 * @author zengqingzhuang(zengqingzhuang@baidu.com)
 * @description tpl类型的列字段格式化方法文件
 * @since 2017/09/20
*/
import moment from 'moment';
import _ from 'lodash';
import {getApiData} from '../util/filterObject';
_.templateSettings.imports = {
    // 时间戳格式化
    formatTimeStamp(val, format = 'YYYY-MM-DD') {
        val = val ? parseInt(val, 10) : new Date().getTime();
        return moment(val).format(format);
    },
    // 超出多少个字符后显示小数点
    overFlowEllipsis(val, count) {
        if (val && val.length > count) {
            return val.substring(0, count) + '...';
        }
        return val;
    },
    // 文本链接
    textLinkFormat(val, href, target) {
        let newHref = getApiData({
            api: href,
            value: window.pageData
        }).url;
        delete window.pageData;
        return `<a style="color:#0066cc;" href=${newHref} target=${target}>${val}</a>`;
    }
};