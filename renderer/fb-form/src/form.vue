<template>
    <div class="fb-form" v-if="schema">
        <fb-tabs v-if="schema.tabs" :schema="schema"></fb-tabs>
        <fb-field-set v-else-if="schema.fieldSet" v-model="formData" :schema="schema"></fb-field-set>
        <fb-form-item v-else-if="schema.controls" v-model="formData" :schema="schema"></fb-form-item>
    </div>
</template>
<script>
/**
 * @file form.vue
 * @author zengqingzhuang(zengqingzhuang@baidu.com)
 * @desc 由此区分具体使用的表单组件
 * @since 2018/02/01
 */
import _ from 'lodash';
import flat from 'flat';
import FbFieldSet from './field-set';
import FbFormItem from './form-item';
import FbTabs from '../../fb-tabs';
import {mixinSchema} from '../../../src/mixin';
import apify from '../../../src/request/apify';
import objectKey from '../../../src/util/objectKey';
import {getApiData} from '../../../src/util/filterObject';

export default {
    mixins: [mixinSchema],
    data() {
        return {
        }
    },
    components: {
        FbFieldSet,
        FbTabs,
        FbFormItem
    },
    created() {
        _.assign(this.formData, objectKey(this.schema), this.globalData);
        this.$watch('globalData', (val) => {
            _.assign(this.formData, this.globalData);
        });
    },
    mounted() {
        const initApi = this.schema.initApi;
        if (initApi) {
            const apiData = getApiData({
                api: initApi,
                pageData: this.globalData
            });
            apify(apiData.url, apiData.method).initApi(apiData.params).then((ret)=> {
                _.assign(this.formData, this.globalData, flat(ret.data, {safe: true}));
            });
        }
    }
}
</script>

<style type="text/less" lang="less">
</style>
