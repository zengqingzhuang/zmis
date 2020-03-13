
<script lang="jsx">
    /**
     * @file button-toggle.vue
     * @author zengqingzhuang(zengqingzhuang@baidu.com)
     *
     * @since 2017
     */
    import {mixinSchema} from '../../../src/mixin';


    export default {
        mixins: [mixinSchema],
        props: {
        },
        data() {
            return {

            };
        },
        methods: {
            showMethod() {
                this.model[this.schema.name] = !this.model[this.schema.name];
            }
        },
        render(h){
            const vm = this;

            // 只能单向操作(展开或关闭)
            if(vm.schema.onceClick && this.model[vm.schema.name] == true) {
                return;
            }
            return (
                <el-button
                    disabled={disabled}
                    type={vm.schema.level || "primary"}
                    onClick = {this.showMethod}>
                    { this.model[vm.schema.name] ? (vm.schema.expandedText||"展开") : (vm.schema.text||"收起")}
                </el-button>
           );
        }
    }

</script>
