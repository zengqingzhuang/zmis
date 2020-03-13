<template>
    <el-autocomplete
        v-model="model[schema.name]"
        class="sheet-el-input-search"
        :fetch-suggestions="querySearchAsync"
        :valueKey="format"
        :trigger-on-focus="false"
        :disabled="disabled"
        placeholder="请输入搜索内容"
        @select="handleSelect"
    ></el-autocomplete>
</template>

<script>
    /**
     * @file  搜索联想
     * @author jiamiao(jiamiao@baidu.com)
     * @desc input模糊搜索
     * @since 2017/10/26
     * @param {string} format 根据接口中返回的数据格式来规定联想中展示数据的key值，默认为value
     * @param {string} queryAlise 把搜索字段传给搜索接口的key值，默认为query
     * @param {int} debouncedTime 防抖时间,默认300ms
     */
    import _ from 'lodash';
    import queryS from 'query-string';
    import {mixinSchema} from '../../../src/mixin';
    import apify from  '../../../src/request/apify';
    import {getApiData} from '../../../src/util/filterObject';
    export default {
        mixins: [mixinSchema],
        props: {
        },
        data() {
            let vm = this;
            return {
                debouncedTime: this.schema.debouncedTime || 300,
                format: vm.schema.format || 'value'
            };
        },
        created() {
            const vm = this;
            // 监控字段，若model中对应value改变，跟着改变
            vm.$watch('model.' + vm.schema.name, function(newVal, oldVal) {
                vm.model[vm.schema.name] = newVal;
            });
        },
        methods: {
            // 每次输入时触发
            querySearchAsync(queryString, cb) {
                let vm = this;
                (_.debounce(async function(){
                    const SOURCE = vm.schema.source;
                    if (SOURCE) {
                        if (!queryString) {
                            cb([]);
                            return;
                        }
                        let queryKey = vm.schema.queryAlise || 'query';
                        let params = {};
                        params[queryKey] = queryString;
                        let api = getApiData({
                            pageData: vm.model,
                            api: SOURCE
                        });
                        let cityList = await apify(api.url, api.method).initApi(params);
                        let cityData = cityList.data;
                        cityData ? cb(cityData) : cb([]);
                    }
                }, vm.debouncedTime))();
            },
            // 点击选中建议项时触发
            handleSelect(select) {
                let vm = this;
                let format = vm.schema.format;
                vm.model[vm.schema.name] = select[format]; 
            }
        }
    };
</script>

<style type="text/less">

  .sheet-el-input-search {
      width: 100%;
  }

</style>
