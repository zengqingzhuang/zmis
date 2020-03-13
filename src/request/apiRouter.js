/**
 * @file apiRouter.js
 * @author yuchao03(yuchao03@baidu.com)
 * @desc 提供api请求前后修改数据的策略
 * @since 2017
 */
import _ from 'lodash';
import url from 'url';

export default {
    apiRouterHandle(vue$$, vector) {
        const apiRouter = vue$$.GLOBAL && vue$$.GLOBAL.apiRouter;
        if (apiRouter) {
            const uri = vector.option['x-uri'].valueOf();
            const parsed =  url.parse(uri);
            const general = apiRouter.config.hookConfig.general;
            const pathname = general[parsed.pathname];

            if (pathname) {
                return apiRouter.hooks[pathname.hook][pathname.action];
            }
        }

        return {
            before(data) {
                return data;
            },
            after(data) {
                return data;
            }
        };
    },
    install(vue$, apiHook) {
        const vue$$ = vue$.prototype;
        // 注册api接口列表
        vue$$.GLOBAL = vue$$.GLOBAL || {};
        if (vue$$.GLOBAL.apiRouter) {
            _.merge(vue$$.GLOBAL.apiRouter,
                {apiRouterHandle: vector => this.apiRouterHandle(vue$$, vector), ...apiHook});
            console.warn('The apiHook already exists.  do not overwrite it please!');
            return;
        }
        vue$$.GLOBAL.apiRouter = {apiRouterHandle: vector => this.apiRouterHandle(vue$$, vector), ...apiHook};
    }
};
