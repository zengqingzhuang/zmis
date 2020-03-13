/**
 * @file apify.js
 * @author yuchao03(yuchao03@baidu.com)
 *
 * @since 2017/09/11
 */
import Vue from 'vue';
import cleanDeep from 'clean-deep';
import {apify, request} from 'i-apify';

import sourcefy from './sourcefy';
import apiMessage from './apiMessage';
import formUrlencoded from 'form-urlencoded';

import {token} from '../token';

const vue$ = new Vue().__proto__;
const  OPTION = {
    'x-timeout': 60000,
    timeout: 60 * 1000,
    credentials: 'include',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
};

// global option
let handler = {
    'x-timeout': 60000,
    success(response, option) {
        let {data = {}} = response;

        token.key = data.csrfToken || '';

        const apiRouter = vue$.GLOBAL && vue$.GLOBAL.apiRouter;

        if (apiRouter) {
            const vector = {option, data};
            data = apiRouter.apiRouterHandle(vector).after(data);
        }
        // 接口状态统一处理
        apiMessage(vue$, data);

        return data;
    },
    error(response, option) {
        let {data = {}} = response;

        token.key = data.csrfToken || '';
        console.warn(`${data.message}`);
        option['x-uri'] && console.log(`${option['x-uri']}`);

        return data;
    },
    payload(data, option) {
        const apiRouter = vue$.GLOBAL && vue$.GLOBAL.apiRouter;

        if (apiRouter && option['x-method'] !== 'GET') {
            const vector = {option, data};

            let body = apiRouter.apiRouterHandle(vector).before(JSON.parse(data.body));

            body = Object.assign({}, body, {csrfToken: token.key});
            //body = cleanDeep(body);
            data.body = formUrlencoded(body);
        }

        return data;
    }
};
let option = Object.assign({}, OPTION, {handler});

export default (initApi, requestType) => {
    const apiList = (vue$.GLOBAL && vue$.GLOBAL.apiConnections) || {initApi: ''};
    initApi && (apiList.initApi = sourcefy(initApi));
    return apify(requestType || request.post, apiList, option);
};
