/**
 * @file stateHandler.js
 * @author zengqingzhuang(zengqingzhuang@baidu.com)
 * @description 页面元素状态处理
 * @since 2017/09/21
 */
import _ from 'lodash';
import {getPageData} from './filterObject';
import executeExpress from './express';
export default params => {
    try {
        let data = getPageData(params);
        let vNode = params.vNode;
        let domState = {
            required: false, // 默认非必填
            visible: true, // 默认显示
            disabled: false // 默认可用
        };
        // 必填项校验
        if (vNode.required !== undefined) {
            domState.required = vNode.required;
        } else if (vNode.requiredOn !== undefined) {
            domState.required = executeExpress(vNode.requiredOn, data);
            domState.required = domState.required ? true : false;
        }
        // 是否可用
        if (vNode.visible !== undefined) {
            domState.visible = vNode.visible;
        } else if (vNode.visibleOn !== undefined) {
            domState.visible = executeExpress(vNode.visibleOn, data);
            domState.visible = domState.visible ? true : false;
        }
        // 是否显示
        if (vNode.disabled !== undefined) {
            domState.disabled = vNode.disabled;
        } else if (vNode.disabledOn !== undefined) {
            domState.disabled = executeExpress(vNode.disabledOn, data);
            domState.disabled = domState.disabled ? true : false;
        }
        return domState;
    } catch (e) {
        // 报错，说明不满足条件，则默认隐藏组件
        return {required: false, disabled: false, visible: false};
    }
};