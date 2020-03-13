<template>
    <iframe width="100%" :height="iframeHeight" :src="src"></iframe>
</template>

<script>
    /**
     * @file  搜索联想
     * @author zengqingzhuang(zengqingzhuang@baidu.com)
     * @desc iframe的简单封装
     * @since 2017/10/26
     * @param {string} format 根据接口中返回的数据格式来规定联想中展示数据的key值，默认为value
     * @param {string} queryAlise 把搜索字段传给搜索接口的key值，默认为query
     * @param {int} debouncedTime 防抖时间,默认300ms
     */
    import {mixinSchema} from '../../../src/mixin';
    import apify from  '../../../src/request/apify';
    import _ from 'lodash';
    export default {
        mixins: [mixinSchema],
        props: {
        },
        data() {
            let vm = this;
            return {
                src: vm.schema.url || '',
                iframeHeight: vm.schema.iframeHeight || 300
            };
        },
        async created() {
            const vm = this;
            if (vm.schema.api) {
                let res = await apify(vm.schema.api).initApi({});
                vm.src = res.data.url;
            }
        }
    };
</script>

<style type="text/less">
</style>
