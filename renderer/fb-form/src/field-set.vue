<script lang="jsx">
    /**
    * @file field-set.vue
    * @author zengqingzhuang(zengqingzhuang@baidu.com)
    * @description 可折叠式表单渲染组件
    * @since 2018/01/30
    */
    import _ from 'lodash';
    import flat from 'flat';
    import {mapState} from 'vuex';
    import FbAction from '../../fb-action';
    import FbSheet from './sheet';
    import {mixinSchema} from '../../../src/mixin';
    import stateHandler from '../../../src/util/stateHandler';
    import {getFilterData} from '../../../src/util/filterObject';
    export default {
        mixins: [mixinSchema],
        data() {
          return {
                // 打开全部折叠项
                activeNames: []
            }
        },
        components: {
            FbSheet,
            FbAction
        },
        created() {
            let schema = this.schema;
            // 打开全部折叠项
            schema.fieldSet.map(field => {
                if (!field.collapsed) { // 收集默认展开的name
                    this.activeNames.push(field.title);    
                }
            });
            if (schema.buttonClassName) {
                schema.buttonClassName = 'fieldset-btn-style ' + schema.buttonClassName;
            } else {
                schema.buttonClassName = 'fieldset-btn-style right';
            }
        },
        methods: {
            getFormData(next) {
                const sheetForm = this.$refs[this.schema.name];
                let isRight = true;
                // combo组件数据校验
                sheetForm.$children.forEach(childP => {
                    childP.$children.forEach(childC => {
                        let fbcombo = childC.$refs.fbcombo;
                        fbcombo && fbcombo.$children.forEach(child => {
                            child.validate && child.validate(valid => {
                                !valid && (isRight = false);
                            });
                        });
                    });
                });
                if (!isRight) return;
                // 其它组件数据校验
                sheetForm.validate(valid => {
                    if (valid) {
                        let controlList = [];
                        this.schema.fieldSet.forEach(item => {
                           controlList.push(item.controls);
                        });
                        next && next(getFilterData(controlList, this.model)); // 回调调用者事件
                        this.callback && this.callback(this.model); // 回调父组件事件
                    }
                });
            }
        },
        computed: {
            ...mapState(['formDisabled'])
        },
        render(h) {
            let schema = this.schema;
            let actions = '';
            // 把链式name转换成对象
            // let modelObject = flat.unflatten(this.model, {safe:true});
            if (schema.actions) {
                actions = <fb-action
                    v-model={this.model}
                    disabled={this.formDisabled}
                    schema = {schema.actions}
                    buttonClassName = {schema.buttonClassName}
                    callback = {this.getFormData}>
                </fb-action>
            }
            if (schema.fieldSet) {
                const elCollapse = schema.fieldSet.map(field => {
                    // 处理禁用和隐藏函数表达式
                    const fieldUseState =  stateHandler({
                        vNode: field,
                        pageData: this.model
                    });
                    // field是否显示
                    let visible = fieldUseState.visible;
                    if (!visible) {
                        return (<el-collapse-item class='el-collapse-item-hidden'></el-collapse-item>);
                    }
                    return (<el-collapse-item
                                title={field.title}
                                name={field.title}>
                                <fb-sheet
                                    ref="fbsheet"
                                    v-model={this.model}
                                    disabled={this.formDisabled}
                                    schema = {field.controls}>
                                </fb-sheet>
                            </el-collapse-item>);
                });
                return (<el-collapse value={this.activeNames}>
                            <el-form
                                ref={schema.name} 
                                model={this.model} 
                                label-width={(schema.labelWidth || 100) + 'px'}
                                label-position= {schema.labelPosition || 'right'}>
                                {elCollapse} {actions}
                            </el-form>
                        </el-collapse>);
            }
        }
    }
</script>
<style type="text/less" lang="less">
    .el-collapse-item-hidden {
        display: none;
    }
    .fieldset-btn-style {
        margin: 10px 0;
    }
    .el-collapse-item__header {
        font-size: 18px !important;
    }
</style>