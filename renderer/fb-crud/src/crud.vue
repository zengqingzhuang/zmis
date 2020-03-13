<template>
    <div>
        <fb-panel v-if="schema.filter"
            :title="schema.filter.title">
            <fb-form-item 
                v-model="formData"
                :callback="refreshTable"
                :schema="schema.filter">
            </fb-form-item>
        </fb-panel>
        <fb-table ref="fbtable" :schema="schema" v-model="formData"></fb-table>
    </div>
</template>
<script>
    /**
     * @file crud.vue
     * @author zengqingzhuang(zengqingzhuang@baidu.com)
     * @description 带筛选条件的表格
     * @since 2018/02/06
    */
    import _ from 'lodash';
    import {mixinSchema} from '../../../src/mixin';
    import FbTable from '../../fb-table';
    import FbPanel from '../../fb-page/src/fb-panel';
    import FbFormItem from '../../fb-form/src/form-item';
    import objectKey from '../../../src/util/objectKey';
    export default {
        mixins: [mixinSchema],
        data() {
            return {
            };
        },
        created() {
            let schema = this.schema;
            let filter = schema.filter;
            // 取crud的name,当做filter的表单名字
            if (filter) {
                filter.name = schema.name;
                    if (filter.reset) { // 有重置按钮
                        if (filter.buttonClassName) {
                            filter.buttonClassName = 'filter-btn-style ' + filter.buttonClassName;
                        } else {
                            filter.buttonClassName = 'filter-btn-style right';
                        }
                    }
                    // 如果filter没配置按钮则默认会自带查询按钮
                    if (!filter.actions || filter.actions.length === 0) {
                        filter.actions = [
                            {
                                "type": "submit",
                                "label": "查询"
                            }
                        ];
                    }
            };
            _.assign(this.formData, objectKey(this.schema), this.globalData);
            this.$watch('globalData', (val) => {
                _.assign(this.formData, this.globalData);
            });
        },
        components: {
            FbTable,
            FbPanel,
            FbFormItem
        },
        methods: {
            refreshTable(){
                this.$refs.fbtable.filterChangeHandler();
            },
            resetForm() {
                this.setDefaultValue(this.schema.filter.controls);
            },
            setDefaultValue(controls) {
                controls.forEach(control => {
                    if (control instanceof Array) {
                        this.setDefaultValue(control);   
                    } else {
                        control.value = control.value !== undefined ? control.value : null;
                        this.formData[control.name] = control.value;
                    } 
                });
            }
        },
        mounted() {
            if (this.schema.filter && this.schema.filter.reset) {
                let actionDom = document.querySelector('.filter-btn-style');
                let resetBtn = document.createElement('button');
                resetBtn.innerText = '重置'
                resetBtn.className = 'reset';
                resetBtn.onclick = () => {
                    this.resetForm();
                    return false;
                }
                actionDom.appendChild(resetBtn);
            }
        }
    }

</script>
<style type="text/less" lang="less">
    .reset {
        display: inline-block;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        background: #fff;
        border: 1px solid #d8dce5;
        color: #8d94a0;
        -webkit-appearance: none;
        text-align: center;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        outline: 0;
        margin: 0;
        -webkit-transition: .1s;
        transition: .1s;
        font-weight: 500;
        padding: 11px 20px;
        font-size: 14px;
        border-radius: 4px;
        &:hover {
            color: #409EFF;
            border-color: #c6e2ff;
            background-color: #ecf5ff;
        }
    }
</style>