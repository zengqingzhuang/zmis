<script lang="jsx">
    /**
     * @file combo.vue
     * @author zengqingzhuang(zengqingzhuang@baidu.com)
     * @description combo组合组件
     * @since 2018/03/16
     */
	import _ from 'lodash';
    import flat from 'flat';
    import mixinSchema from '../../../src/mixin/schema';
    import FbSheet from '../../fb-form/src/sheet';
    export default {
    	data() {
    		return {
                comboData: []
    		}
    	},
    	mixins: [mixinSchema],
        beforeCreate() {
            this.$options.components.FbSheet = FbSheet;
        },
    	created() {
            let cptData = this.model[this.schema.name];
            if (cptData && cptData.length > 0) {
                this.comboData = cptData;
            } else {
                this.addSubItem();  
            }
    	},
        watch: {
            comboData: {
                handler(newVal, oldVal) {
                    this.model[this.schema.name] = newVal;
                },
                deep: true
            }
        },
    	methods: {
            // 添加一组
            addSubItem() {
                let itemIndex = this.comboData.length;
                this.comboData.push({});
                this.schema.form.controls.forEach(controls => {
                    let formControls = Array.isArray(controls) ? controls : [controls];
                    formControls.forEach((item) => {
                        let value = (item.value || item.value === 0) ? item.value : '';
                        this.$set(this.comboData[itemIndex], item.name, value);
                    });
                });
            },
            // 删除一组
            delSubItem(index) {
                this.comboData.splice(index, 1);
            }
    	},
    	render(h) {
            let form = this.schema.form;
            let labelWidth = (form.labelWidth || 100) + 'px';
            let rows = this.comboData.map((data, index) => {
    			let delButton = this.schema.multiple ? <el-button class="rounded pos" onClick={this.delSubItem.bind(this, index)}><i class="fa fa-minus text-danger"></i></el-button> : null;
				return (
                    <el-form
                        class="hbox"
                        ref="comboForm"
                        model = {data} 
                        label-width = {labelWidth}
                        label-position = {form.labelPosition || 'right'}>
                        <fb-sheet
                            v-model={this.comboData[index]}
                            disabled={this.formDisabled}
                            schema = {form.controls}>
                    </fb-sheet>{delButton}
                </el-form>)
    		});
    		const addButton = this.schema.multiple ? <el-button style={{"margin-left": labelWidth}} class="rounded" onClick={this.addSubItem}><i class="fa fa-plus"></i></el-button> : null;
            return (<div class="finbox-combo">{rows} {addButton}</div>);
    	}
    }
</script>
<style type="text/css" lang="less">
    .finbox-combo {
        .hbox {
            position: relative;
            margin-right: 40px;
        }
        .el-form-item {
            margin-bottom: 22px;
        }
        .text-danger {
            color: #f05050;
        }
        .pos {

            position: absolute;
            right: -40px;
            top: 3px;
        }
        .rounded {
            padding: 5px 5px;
            cursor: pointer;
            width: 28px;
            height: 28px;
            border-radius: 500px;
            color: #58666e!important;
            background-color: #fcfdfd;
            border-color: #dee5e7;
            background-color: #fff;
            border-bottom-color: #d8e1e3;
            -webkit-box-shadow: 0 1px 1px rgba(90,90,90,.1);
            box-shadow: 0 1px 1px rgba(90,90,90,.1);
        }
    }
</style>>