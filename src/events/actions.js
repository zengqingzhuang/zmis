/**
 * @file events.js
 * @author zengqingzhuang(zengqingzhuang@baidu.com)
 *
 * @since 2017/12/20
 */
export default {
    install(vue$, events) {
        const vue$$ = vue$.prototype;
        // 注册按钮扩展事件
        vue$$.GLOBAL = vue$$.GLOBAL || {};
        vue$$.GLOBAL.actionEvents = events;
    }
};
