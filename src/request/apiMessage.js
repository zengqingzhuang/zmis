/**
 * @file apiMessage.js
 * @author yuchao03(yuchao03@baidu.com)
 * @desc 接口状态码统一处理
 * @since 2017/11/02
 */

import _ from 'lodash';
export default async (vue$, message) => {

    // 消息提示映射表
    const messageConf = vue$.GLOBAL && vue$.GLOBAL.messageConf;

    if (messageConf) {
        if (!Array.isArray(messageConf.userMap)) {
            throw '"messageConf.userMap" must be Array type';
        }

        // 需要被处理的status
        let needMap = false;
        if (Array.isArray(messageConf.statusRange)) {
            messageConf.statusRange.forEach(segment => {
                // 在需要处理范围内
                if (message && message.status >=  segment.begin && message.status <= segment.end) {
                    // 同时没有被忽略
                    for (let ignoreStatus of messageConf.ignoreStatus) {
                        if (ignoreStatus !== message.status) {
                            needMap = true;
                            return;
                        }
                    }
                    return false;
                }
            });
        }
        // 需要处理
        if (needMap) {

            // 使用用户自定义消息体
            if (messageConf.userMap.length > 0) {
                _.merge(message, _.find(messageConf.userMap, function (item) {
                    if (item.status === message.status) {
                        return item;
                    }
                }));
            }
        }
        else {
            // 用户自定义不需要处理
            return;
        }
    }
    // 强制不处理status
    if (message.status === 0) {
        return;
    }



    // 处理消息体
    vue$.$alert(message.msg, message.title || '', {
        confirmButtonText: '确定',
        type: message.level || 'info',
        dangerouslyUseHTMLString:true,
        center: true,
        callback: action => {

            message.action && vue$.$message({
                type: message.action.type || 'info',
                message: message.action.message || `action: ${ action }`
            });
            message.redirect && (setTimeout(() =>
            {
                window.location.href = message.redirect.url;
            }, message.redirect.delay || 0));

        }
    });

};
