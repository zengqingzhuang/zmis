/**
 * @file filterObject.js
 * @author zengqingzhuang(zengqingzhuang@baidu.com)
 * @description 过滤器方法
 * @since 2018/02/05
 */
import url from 'url';
import _ from 'lodash';
import queryString from 'query-string';
import {request} from 'i-apify';
// 拼接api数据
export function getApiData(params) {
    if (!params.api) {
        throw new Error('api不能为空');
    }
    let pageData = getPageData(params);
    // post请求数据
    let requestData = {};
    // 请求地址
    let requestApi = '';
    // 请求方式 post/get
    let method = request.post;
    if (params.api instanceof Object) {
        let api = params.api;
        let apiData = api.data;
        requestApi = api.url;
        if (apiData) {
            Object.keys(apiData).forEach(key => {
                const localKey = apiData[key];
                if (localKey.startsWith('$')) {
                    let value = _.get(pageData, localKey.replace('$', ''));
                    requestData[key] = (value || value === 0) ? value : '';
                } else {
                    requestData[key] = localKey;
                }
            });
        }
        if (api.method && api.method.toLocaleLowerCase() === 'get') {
            method = request.get;
        }
    }
    else {
        let path = url.parse(params.api);
        if (path.query) {
            let query = queryString.parse(path.query);
            let newParams = [];
            Object.keys(query).forEach(key => {
                let localKey = query[key];
                if (localKey.startsWith('$')) {
                    let value = _.get(pageData, localKey.replace('$', ''));
                    value = (value || value === 0) ? value : '';
                    newParams.push(`${key}=${value}`);
                } else {
                    newParams.push(`${key}=${localKey}`);
                }
            });
            requestApi = `${path.pathname}?${newParams.join('&')}`;
        }
        else {
            requestApi = params.api;
        }
    }
    // 返回请求地址及数据
    return {
        url: requestApi,
        params: requestData,
        method: method
    };
}
// 获取页面组合数据
export function getPageData(params) {
    function valueHandler(data) {
        let newData = {};
        if (Array.isArray(data)) { // 如:表格选中了多行数据
            data.forEach(item => {
                Object.keys(item).forEach(key => {
                    // if (item[key] || item[key] === 0) {
                    !newData[key] && (newData[key] = []);
                    newData[key].push(item[key]);
                    // }
                });
            });
            Object.keys(newData).forEach(key => {
                newData[key] = newData[key].join(',');
            });
            return newData;
        }
        // Object.keys(data).forEach(key => {
        //     if (data[key] || data[key] === 0) {
        //         newData[key] = data[key];
        //     }
        // });
        return data;
    }
    return _.assign(
        {},
        valueHandler(params.pageData || {}),
        {rowData: valueHandler(params.value || {})}
    );
}
// 获取筛选条件数据
export function getFilterData(controls, model) {
    let names = [];
    let filterData = {};
    function getNames(controls) {
        for (let i = 0; i < controls.length; i++) {
            if (controls[i] instanceof Array) {
                getNames(controls[i]);
            } else {
                let name = controls[i].name;
                name && names.push(name);
            }
        }
        return names;
    }
    getNames(controls);
    names.forEach(name => {
        let value = model[name];
        (value === null || value === undefined) ? value = '' : value;
        filterData[name] = value;
    });
    return filterData;
}