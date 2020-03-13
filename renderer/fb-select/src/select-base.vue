<script lang="jsx">
    /**
     * @file select-base.vue
     * @author jiamiao(jiamiao@baidu.com)
     *
     * @since 2017
     */
    import {mixinSchema} from '../../../src/mixin';
    import {getElValue} from '../../../src/util/modelObject';
    export default {
        mixins: [mixinSchema],
        data() {
            return {
            }
        },
        created() {
            // 若设置了value或valueTemplate属性，要取默认值，分别处理，getElValue所需参数不同
            // let option = this.schema.valueTemplate ? {name: this.schema.name, valueTemplate: this.schema.valueTemplate} : {name: this.schema.name};
            // const schemaVlue = getElValue(this.model, option);
            // // 这里不等于null因为有可能value的默认值设为''
            // if (schemaVlue !== null) {
            //     // 如果有valueTemplate属性，则计算出值后要重新赋给schemaKeys
            //     if (this.schema.valueTemplate) {
            //         //this.updateForm(this.schema.name, schemaVlue);
            //     }
            //     this.elValue = schemaVlue;
            // }
            // // 如果没有valueTemplate和value，去接口拿value时在created里vuex还没赋值，都是null，所以还需要用watch轮询
            // this.$watch('model.' + this.schema.name, function(newVal, oldVal) {
            //     if(this.schema.multiple) {
            //         if(!Array.isArray(newVal)) {
            //             if(newVal===null) {
            //                 this.elValue =[];
            //             } else {
            //                 this.elValue = [newVal];
            //             }
            //         } else {
            //             this.elValue = newVal;
            //         }
            //     }
            //     else {
            //         this.elValue = newVal;
            //     }
            // });
        },
        render(h){
            let selectOptions = [];
            let options = this.schema.options || [];
            options = options.concat(this.model[this.schema.sourceName] || []);
            options.map(function(option){
                selectOptions.push(<el-option
                key={option.value}
                label={option.label}
                value={option.value}
                disabled={option.disabled}></el-option>);
            });
            return (
                <el-select
                    class="sheet-el-select-base"
                    multiple={this.schema.multiple||false}
                    disabled={this.disabled}
                    filterable
                    placeholder={this.schema.placeholder||'请选择'}
                    clearable={this.schema.clearable||false}
                    v-model={this.model[this.schema.name]}>
                        {selectOptions}
                </el-select>
            );
        }
    }
</script>

<style type="text/less">

  .sheet-el-select-base {
      width: 100%;
  }

</style>

