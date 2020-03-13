/**
 * @file sourcefy.js
 * @author yuchao03(yuchao03@baidu.com)
 * @desc 处理url参数,赋值
 * @since 2017/09/11
 */
import _ from 'lodash';
import queryString from 'query-string';
export default sourceStr => {

    const SOURCE_SEARCH = window.location.search;
    const SOURCE_SEARCH_SHORT = SOURCE_SEARCH.substring(SOURCE_SEARCH.indexOf('?'), SOURCE_SEARCH.length);
    const parsed =  queryString.parse(SOURCE_SEARCH_SHORT);

    Object.keys(parsed).forEach(name => {
        sourceStr = _.replace(sourceStr, '$' + name, parsed[name]);

    });

    return sourceStr;
};
