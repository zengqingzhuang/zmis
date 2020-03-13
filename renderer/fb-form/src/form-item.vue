<script lang="jsx">
    /**
    * @file form-item.vue
    * @author zengqingzhuang(zengqingzhuang@baidu.com)
    * @description 表单渲染组件
    * @since 2018/01/30
    */
    import _ from 'lodash';
    import flat from 'flat';
    import {mapState} from 'vuex';
    import FbSheet from './sheet';
    import FbAction from '../../fb-action';
    import {mixinSchema} from '../../../src/mixin';
    import {getFilterData} from '../../../src/util/filterObject';
    export default {
        mixins: [mixinSchema],
        data() {
            return {
            }
        },
        components:{
            FbSheet,
            FbAction
        },
        methods: {
            getFormData(next) {
                // combo组件数据校验
                let fbcombo = this.$refs.fbsheet.$refs.fbcombo;
                let isRight = true;
                if (fbcombo) {
                    fbcombo.$children.forEach(child => {
                        child.validate && child.validate(valid => {
                            !valid && (isRight = false);
                        });
                    });
                }
                if (!isRight) return;
                // 其它组件数据校验
                const sheetForm = this.$refs[this.schema.name];
                sheetForm.validate(valid=> {
                    if (valid) {
                        next && next(getFilterData(this.schema.controls, this.model)); // 回调调用者事件
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
            return (
                <el-form 
                        ref = {schema.name} 
                        model = {this.model} 
                        label-width = {(schema.labelWidth || 100) + 'px'}
                        label-position = {schema.labelPosition || 'right'}>
                        <fb-sheet
                            ref="fbsheet"
                            v-model = {this.model}
                            disabled={this.formDisabled}
                            schema = {schema.controls}>
                        </fb-sheet>
                        {actions}
                </el-form>
            )
        }
    }
</script>
<style lang="less" type="text/less">
</style>