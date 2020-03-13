/**
 * @file messageMap.js
 * @author yuchao03(yuchao03@baidu.com)
 * @desc 消息提示映射
 * @since 2017/09/11
 */
import _ from 'lodash';
export default {
    install(vue$, messageConf) {
        const vue$$ = vue$.prototype;
        // 注册api接口列表
        vue$$.GLOBAL = vue$$.GLOBAL || {};
        if (vue$$.GLOBAL.messageConf) {
            _.merge(vue$$.GLOBAL.messageConf, messageConf);
            console.warn('The messageConf already exists.  do not overwrite it please!');
            return;
        }
        vue$$.GLOBAL.messageConf = messageConf;
    }
};
