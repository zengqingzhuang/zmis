/**
 * @file vuex store
 * @author yuchao03(yuchao03@baidu.com)
 *
 * @since 2017/09/15
 */

import 'babel-polyfill';
import Vue from 'vue';
import VueX from 'vuex';

Vue.use(VueX);

let option = {
    state: {
        globalData: {}, // 存储全局数据源
        dialogInfo: {}, // 弹窗信息
        pageSchema: {}, // 页面json
        formDisabled: false // 表单里的组件是否可用
    },
    mutations: {
        ['GLOBALDATA'](state, payload) {
            state.globalData = payload;
        },
        ['PAGESCHEMA'](state, payload) {
            state.pageSchema = payload;
        },
        ['DIALOGINFO'](state, payload) {
            state.dialogInfo = payload;
        },
        ['FORMDISABLED'](state, payload) {
            state.formDisabled = payload;
        }
    },
    actions: {
        globalData({commit}, payload) {
            commit('GLOBALDATA', payload);
        },
        pageSchema({commit}, payload) {
            commit('PAGESCHEMA', payload);
        },
        dialogInfo({commit}, payload) {
            commit('DIALOGINFO', payload);
        },
        formDisabled({commit}, payload) {
            commit('FORMDISABLED', payload);
        }
    }
};

let store =  new VueX.Store(option);

export default store || {};
