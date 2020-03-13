/**
 * @file index.js
 * @author zengqingzhuang(zengqingzhuang@baidu.com)
 * @description 获取finbox公共方法文件
 * @since 2018/02/02
 */
// 事件
import actionEvents from './events/actions';
// import eventHub from './events/eventHub';
// token
import {token} from './token';
// api
import apify from './request/apify';
import apiRouter from './request/apiRouter';
import apiPool from './request/apiPool';
import messageMap from './request/messageMap';
// 数据源操作方法
import {getElValue, changeURLPar} from './util/modelObject';
// 公共方法
import objectKey from './util/objectKey';
import {getApiData, getFilterData, getPageData} from './util/filterObject';
import stateHandler from './util/stateHandler';
import executeExpress from './util/express';
// html编码
import {htmlEncode, htmlDecode} from './encoding/html';
// 渲染组件
import FbPage from '../renderer/fb-page/src/page';
import FbAction from '../renderer/fb-action';
import {FbForm, FbFormSet, FbTabs, FbSheet} from '../renderer/fb-form';
import FbTable from '../renderer/fb-table';
import FbDialog from '../renderer/fb-dialog';
module.exports = {
    components: {
        FbPage,
        FbAction,
        FbForm,
        FbFormSet,
        FbTabs,
        FbSheet,
        FbTable,
        FbDialog
    },
    apify,
    apiRouter,
    apiPool,
    messageMap,
    getElValue,
    changeURLPar,
    objectKey,
    getApiData,
    getFilterData,
    getPageData,
    stateHandler,
    executeExpress,
    htmlEncode,
    htmlDecode,
    actionEvents,
    // eventHub,
    token
};
