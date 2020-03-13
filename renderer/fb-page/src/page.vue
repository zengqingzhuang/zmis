<template>
    <div class="page-wrapper">
        <fb-aside v-if="aside" :schema="aside"></fb-aside>
        <fb-toolbar v-if="toolbar" :schema="toolbar"></fb-toolbar>
        <fb-body v-if="body" :schema="body"></fb-body>
        <fb-dialog></fb-dialog>
    </div>
</template>
<script>
/**
   * @file page.vue
   * @author zengqingzhuang(zengqingzhuang@baidu.com)
   * @description 渲染页面入口组件
   * @since 2018/02/01
   */
import Vue from 'vue';
import _ from 'lodash';
import ElementUI from 'element-ui';
import url from 'url';
import queryString from 'query-string';
import flat from 'flat';
import FbAside from './fb-aside';
import FbBody from './fb-body';
import FbToolbar from './fb-toolbar';
import FbDialog from '../../fb-dialog';
import store from '../../../src/state/store';
import {getApiData} from '../../../src/util/filterObject';
// import eventHub from '../../../src/events/eventHub';
import apify from '../../../src/request/apify';
import {mixinSchema} from '../../../src/mixin';

// 注册全局http对象
Vue.prototype.$http = apify;
// 注册事件中心
// Vue.use(eventHub);
// 注册elementui组件
Vue.use(ElementUI);

export default {
    mixins: [mixinSchema],
    data() {
        return _.cloneDeep({
            aside: this.schema.aside,
            toolbar: this.schema.toolbar,
            body: this.schema.body
        });
    },
    store,
    created() {
        let pageUrl = url.parse(window.location.href);
        pageUrl.query && _.assign(this.globalData, queryString.parse(pageUrl.query));
        this.$store.dispatch('pageSchema', this.schema);
    },
    mounted() {
        // 最外层initApi，页面通用数据源接口，所有组件共用
        const initApi = this.schema.initApi;
        if (initApi) {
            let pageUrl = url.parse(window.location.href);
            const apiData = getApiData({
                api: initApi,
                pageData: this.globalData
            });
            apify(apiData.url, apiData.method).initApi(apiData.params).then((ret)=> {
                this.$store.dispatch('globalData', _.assign({}, this.globalData, flat(ret.data, {safe: true})));    
            });
        }
    },
    components: {
        FbAside,
        FbBody,
        FbDialog,
        FbToolbar
    }
}
</script>
<style type="text/less" lang="less">
    .page-wrapper {
        background-color: #FFFFFF;
        display: table;
        width: 100%;
        table-layout: fixed;
    }
    .page-content {
        display: table-cell;
        height: auto;
        vertical-align: top;
        float: none;
    }
    h1,h2,h3,h4,h5,h6{ margin: 0;padding: 0; }
    .el-pagination {
        text-align: right;
    }
    .el-tree {
        padding: 10px;
        border: 1px solid #dee5e7;
        background-color: #e4eaec;
    }
    @media screen and  (max-width: 479px){
        .aside,.page-content{display:block !important; width:100% !important; }
    }
</style>