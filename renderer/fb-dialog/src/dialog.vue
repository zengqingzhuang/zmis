<template>
    <el-dialog 
            v-if="visibleDialog"
            :title="title"
            :width="width"
            :visible.sync="visibleDialog"
            :before-close="handleClose">
        <fb-tabs v-if="diaSchema.tabs" v-model="formData" :schema="diaSchema"></fb-tabs>
        <fb-field-set v-else-if="diaSchema.fieldSet" v-model="formData" :schema="diaSchema"></fb-field-set>
        <fb-form-item v-else-if="diaSchema.controls" v-model="formData" :schema="diaSchema"></fb-form-item>
    </el-dialog>
</template>
<script>
    /**
     * @file dialog.vue
     * @author zengqingzhuang(zengqingzhuang@baidu.com)
     * @desc 弹窗组件
     * @since 2017/09/17
     */
    import _ from 'lodash';
    import {mixinSchema} from '../../../src/mixin';
    import FbFormItem from '../../fb-form/src/form-item';
    import FbFieldSet from '../../fb-form/src/field-set';
    import FbTabs from '../../fb-tabs';
    import apify from '../../../src/request/apify';
    import {getApiData} from '../../../src/util/filterObject';
    import objectKey from '../../../src/util/objectKey';
    export default {
        mixins: [mixinSchema],
        components: {
            FbFieldSet,
            FbFormItem,
            FbTabs
        },
        data() {
            return {
                diaSchema: '',
                rules: {}, // 表单验证规则
                title: '提示', // 弹窗标题
                width: "50%", // 弹窗宽度
                visibleDialog: false // 控制dialog 显示
            };
        },
        methods: {
            // 表单校验规则
            addRules(rules) {
                _.merge(this.rules, rules);
            },
            // 弹窗关闭前调用事件
            handleClose(done) {
                // 清空弹窗dialogInfo数据
                this.$store.dispatch("dialogInfo", null);
                // 重置弹窗表单-清空错误提示
                let refsSheet = this.$refs['dialogSheet'];
                if (refsSheet && refsSheet.$refs['dialogForm']) {
                    refsSheet.$refs['dialogForm'].resetFields();    
                }
                // 清空弹窗数据
                Object.keys(this.formData)
                    .forEach(key => this.formData[key] = null);
                done && done();
            }
        },
        watch: {
            async dialogInfo(newVal, oldVal) {
                if (newVal) {
                    if (newVal.visibleDialog === false) {
                        this.visibleDialog = false;
                        this.handleClose();
                        return;
                    }
                    if (newVal.body) {
                        let body = newVal.body;
                        let rowData = this.dialogInfo.elValue;
                        let pageData = this.dialogInfo.model;
                        this.title = newVal.title;
                        this.width = newVal.width ? newVal.width + "px" : "50%";
                        if (newVal.width && newVal.width.endsWith('%')) {
                            this.width = newVal.width;
                        };
                        this.diaSchema = body;
                        _.assign(this.formData, objectKey(body));
                        if (body.initApi) { // 初始化弹窗数据接口
                            let apiData = getApiData({
                                value: rowData,
                                pageData: pageData, // 表单数据
                                api: body.initApi
                            });
                            let result = await apify(apiData.url, apiData.method).initApi(apiData.params);
                            _.assign(this.formData, result.data);
                        } else if (!Array.isArray(rowData)) { // 只传入对象数据
                            _.assign(this.formData, rowData);
                        } else {
                            _.assign(this.formData, pageData);
                        }
                        this.visibleDialog = true;
                    }
                } 
            }
        }
    };
</script>