<script lang="jsx">
    /**
     * @file sheet.vue
     * @author zengqingzhuang(zengqingzhuang@baidu.com)
     * @desc form-set 表单元素集合渲染器
     * @since 2018/01/31
     */

    import _ from 'lodash';
    import flat from 'flat';
    import FbCombo from '../../fb-combo';
    import FbTree from '../../fb-tree';
    import FbNavmenu from '../../fb-navmenu';
    import FbTable from '../../fb-table';
    import FbAction from '../../fb-action';
    import FbSelect from '../../fb-select/select';
    import FbInputSearch from '../../fb-inputsearch';
    import {FbCascader} from '../../fb-cascader';
    import FbDateRangeLess from '../../fb-daterangeless';
    import {
        FbButtonToggle,
        FbStatic,
        ExtendComponent,
        FbNumberRange,
        FbIframe,
        FbFile,
        FbImage,
        FbDivider
    } from '../../../component';
    import {mixinSchema} from '../../../src/mixin';
    import {getElValue} from '../../../src/util/modelObject';
    import stateHandler from '../../../src/util/stateHandler';

    export default {
        mixins: [mixinSchema],
        data() {
            return {
            }
        },
        components: {
            FbDivider,
            FbCombo,
            FbTree,
            FbNavmenu,
            FbButtonToggle,
            FbSelect,
            FbCascader,
            FbStatic,
            FbFile,
            FbImage,
            FbInputSearch,
            FbTable,
            FbAction,
            ExtendComponent,
            FbNumberRange,
            FbDateRangeLess,
            FbIframe
        },
        methods: {
            // 计算表单每行中，隐藏的并且不占位的组件个数
            getNoSpaceCount(controls) {
                return _.filter(controls, control=> {
                    let ctrlUseState =  stateHandler({
                        vNode: control,
                        pageData: this.model
                    });
                    // 隐藏域不占位
                    if (control.type === 'hidden') {
                        return true;
                    }
                    // 不显示&不需要占位
                    if (!ctrlUseState.visible && control.spaceVisible === false) {
                        return true;
                    }
                    return false;
                }).length;
            },
            // 获取校验规则
            getRules(formControl, required) {
                let isReq = null;
                if (formControl.required !== undefined || formControl.requiredOn !== undefined) {
                    isReq = true;
                }
                if (isReq && formControl.validations && formControl.validations instanceof Object) {
                    if (Array.isArray(formControl.validations)) {
                        formControl.validations.forEach(valid => {
                            valid.required = required
                        });
                    } else {
                        formControl.validations.required = required;
                    }
                    return formControl.validations;
                }
                return {required: required, message: '必填项！'};
            },
            // 金额元转分，数据提交
            updateAmount(name, value) {
                value = parseInt(value * 100, 0);
                this.model[name] = value;
                return this.model;
            }
        },
        render(h) {
            const vm = this;
            let elRows = this.vNodes.map((item, index) => {
                let formControls = Array.isArray(item) ? item : [item];
                // 不占位的组件个数
                let invisibleCount = this.getNoSpaceCount(formControls);
                let colCount = formControls.length - invisibleCount;
                // 最多支持同时显示4列
                let span = colCount === 2 ? 12 : colCount === 3 ? 8 : colCount === 4 ? 6 : 24;
                let elCols = formControls.map(formControl => {
                    // 组件
                    let elInput = null;
                    if (Object.keys(formControl).length === 0) { // 空对象占位
                        return  <el-col span={span}></el-col>
                    }
                    // 处理禁用和隐藏函数表达式
                    let ctrlUseState =  stateHandler({
                        vNode: formControl,
                        pageData: this.model
                    });

                    // 组件是否可用
                    let disabled = this.disabled || ctrlUseState.disabled;
                    // 组件是否必填
                    let required = ctrlUseState.required;
                    // 组件是否显示
                    let visible = ctrlUseState.visible;
                    // 组件不显示时，默认清空组件值。可通过设置invisibleClear=false不清空组件值
                    if (!visible) {
                        // if (formControl.invisibleClear !== false) {
                        //     this.model[formControl.name] = null;
                        // }
                        return;
                    };
                    let elValue = getElValue(this.model, formControl);
                    let rules = this.getRules(formControl, required); // 验证规则, 对象或数组都行
                    // 获取节点表达式计算出来的值
                    if (formControl.valueTemplate) {
                        this.model[formControl.name] = elValue;
                        if (formControl.valueTemplateClearable) {
                            // 防止部分组件死循环
                            formControl.valueTemplate = null;    
                        }
                    }
                    // 渲染为不同类型的组件
                    switch (formControl.type) {
                        case 'static':
                            const staticVal = elValue instanceof Object ? JSON.stringify(elValue): elValue ;
                            elInput = <div class="el-form-item__content"> {staticVal} </div>
                            break;
                        case 'iframe':
                            elInput=<fb-iframe elValue={elValue} schema={formControl} v-model={this.model}> </fb-iframe>
                            break;
                        case 'static-map':
                        case 'plain':
                        case 'static-amount':
                            elInput = <fb-static elValue={elValue} schema={formControl} v-model={this.model}></fb-static>
                            break;
                        case 'text':
                            // el-input中value为boolean型会报错
                            if (typeof elValue == "boolean") {
                                elValue = elValue ? 1 : 0;
                            }
                            elInput = <el-input
                                    class="sheet-inline-input"
                                    placeholder={formControl.placeholder}
                                    v-model = {this.model[formControl.name]}
                                    disabled={disabled}>
                                </el-input>
                            break;
                        case 'number':
                            elInput = <el-input-number
                                    class="sheet-el-input-number"
                                    placeholder={formControl.placeholder}
                                    v-model = {this.model[formControl.name]}
                                    disabled={disabled}
                                    controlsPosition={formControl.controlsPosition||"right"}
                                    min={formControl.min||0}
                                    max={formControl.max}
                                    controls={formControl.controls||false}>
                                </el-input-number>
                            break;
                        case 'amount':
                            // 金额分转元, 显示的
                            elValue = (elValue / 100).toFixed(2);
                            elInput = <el-input-number
                                    class="sheet-el-input-number"
                                    placeholder={formControl.placeholder}
                                    onInput = {this.updateAmount.bind(this, formControl.name)}
                                    value = {elValue}
                                    disabled={disabled}
                                    controlsPosition={formControl.controlsPosition||"right"}
                                    min={formControl.min||0}
                                    max={formControl.max}
                                    controls={formControl.controls||false}>
                                </el-input-number>
                            break;
                        case 'number-range':
                            elInput = <fb-number-range
                                    disabled={disabled}
                                    placeholder={formControl.placeholder}
                                    v-model = {this.model[formControl.name]}
                                    elValue={elValue}>
                                </fb-number-range>
                            break;
                        case 'textarea':
                            elInput = <el-input
                                    type='textarea'
                                    class='sheet-el-textarea'
                                    placeholder={formControl.placeholder}
                                    v-model = {this.model[formControl.name]}
                                    maxlength={formControl.maxlength}
                                    disabled={disabled}>
                                </el-input>
                            break;
                        case 'radios':
                            let radioOptions=[];
                            formControl.options instanceof Array &&
                            formControl.options.map(function(option){
                                radioOptions.push( <el-radio label={option.value} > {option.label} </el-radio>);
                            });
                            elInput = <el-radio-group
                                    v-model={this.model[formControl.name]}
                                    disabled={disabled}>
                                    {radioOptions}
                                </el-radio-group>
                            break;
                        case 'select':
                        case 'select-async':
                            elInput = <fb-select disabled={disabled} elValue={elValue} schema={formControl} v-model={this.model}> </fb-select>
                            break;
                        case 'cascader':
                            elInput = <fb-cascader disabled={disabled} elValue={elValue} schema={formControl} v-model={this.model}></fb-cascader>
                            break;
                        case 'year':
                        case 'month':
                        case 'date':
                        case 'week':
                        case 'datetime':
                        case 'datetimerange':
                        case 'daterange':
                            elInput = <el-date-picker
                                    style="width: 100%"
                                    placeholder="选择日期范围"
                                    editable={formControl.editable || false}
                                    value-format={formControl.valueFormat}
                                    v-model={this.model[formControl.name]}
                                    type={formControl.type||'date'}
                                    disabled={disabled}>
                                </el-date-picker>
                            break;
                        case 'daterangeless':
                            elInput = <fb-date-range-less
                                    v-model={this.model[formControl.name]}
                                    placeholder="选择日期"
                                    disabled={disabled}
                                    schema={formControl}>
                                </fb-date-range-less>
                            break;
                        case 'checkboxes':
                            let checkboxOptions = [];
                            formControl.options.map(function(option){
                                checkboxOptions.push(<el-checkbox class='align-left' label={option.value}>{option.label}</el-checkbox>);
                            });
                            elInput = <el-checkbox-group
                                    v-model={this.model[formControl.name]}
                                    disabled={disabled}>
                                    {checkboxOptions}
                                </el-checkbox-group>
                            break;
                        case 'button':
                        case 'submit':
                            elInput = <fb-action disabled={disabled} schema={formControl} v-model={this.model}></fb-action>
                            break;
                        case 'button-toggle':
                            elInput = <fb-button-toggle disabled={disabled} schema={formControl} v-model={this.model}></fb-button-toggle>
                            break;
                        case 'combo':
                            elInput = <fb-combo ref="fbcombo" disabled={disabled} schema={formControl} v-model={this.model}></fb-combo>
                            break;
                        case 'divider':
                            elInput = <fb-divider></fb-divider>
                            break;
                        case 'switch':
                            elInput = <el-switch
                                    v-model={this.model[formControl.name]}
                                    disabled={disabled}
                                    activeText={formControl.onText}
                                    inactiveText={formControl.offText}
                                    activeValue={formControl.activeValue}
                                    inactiveValue={formControl.inactiveValue}>
                                  </el-switch>
                            break;
                        case 'tree':
                            formControl.target = this.vNodes[0].target;
                            elInput = <fb-tree disabled={disabled} schema={formControl} v-model={this.model}></fb-tree>
                            break;
                        case 'nav':
                            elInput = <fb-navmenu disabled={disabled} menuData={formControl.menuData} v-model={this.model}></fb-navmenu>
                            break;
                        case 'table':
                            formControl.target = this.vNodes[0].target;
                            elInput = <fb-table schema={formControl} v-model={this.model}></fb-table>
                            break;
                        case 'file':
                            elInput = <fb-file schema={formControl} disabled={disabled} elValue={elValue} v-model={this.model}></fb-file>;
                            break;
                        case 'image':
                            elInput = <fb-image schema={formControl} disabled={disabled} elValue={elValue} v-model={this.model}></fb-image>;
                            break;
                        case 'input-search':
                            elInput = <fb-input-search disabled={disabled} schema={formControl} v-model={this.model}></fb-input-search>;
                            break;
                        case 'hidden':
                            this.model[formControl.name] = elValue;
                            break;
                        default:
                            if(formControl.type.includes('finbox-')) {
                                elInput = <extend-component disabled={disabled} elValue={elValue} schema={formControl} v-model={this.model}></extend-component>;
                                break;
                            }
                            console.warn('unable to render the schema: ' + JSON.stringify(formControl));
                            break;
                    }
                    if (!elInput) return;
                    if (formControl.type === "tree") { // 树形结构不能放入表单中，样式冲突
                        return elInput;
                    }
                    // 按钮不需要显示label
                    const elFormItem = 
                        (formControl.label && formControl.type !== 'button' && formControl.type !== 'submit') ? 
                        (<el-form-item label={formControl.label} prop={formControl.name} rules={rules}>
                            {elInput}
                        </el-form-item>) : (<div class="el-form-item"> {elInput} </div>);
                    return  <el-col span={span}> {elFormItem} </el-col>
                });
                return <el-row>{elCols}</el-row>;
            });
            return (<div>{elRows}</div>);
        }
    }
</script>
<style type="text/less" lang="less">
    .align-left{margin-left: 0 }
    .el-form--label-left .el-form-item__label {
        padding-left: 14px;
    }
    .sheet-el-input-number {
        width: 100%
    }
    .sheet-el-input-number input {
        text-align: left!important;
    }
</style>
