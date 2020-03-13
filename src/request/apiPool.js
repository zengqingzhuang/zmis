/**
 * @file apiPool.js
 * @author yuchao03(yuchao03@baidu.com)
 * @desc api连接池 引用方法 vue中this.GLOBAL.apiConnections
 * @since 2017/09/11
 */
import _ from 'lodash';
export default {
    install: function (vue$, apiList) {
        const vue$$ = vue$.prototype;
        // 注册api接口列表
        vue$$.GLOBAL = vue$$.GLOBAL || {};
        if (vue$$.GLOBAL.apiConnections) {
            _.merge(vue$$.GLOBAL.apiConnections, apiList);
            console.warn('The apiConnections already exists.  do not overwrite it please!');
            return;
        }
        vue$$.GLOBAL.apiConnections = apiList;
    }
};
