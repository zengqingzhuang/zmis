
<script lang="jsx">
    /**
     * @file static.vue
     * @author zengqingzhuang(zengqingzhuang@baidu.com)
     * @description 静态文本
     * @since 2018-02-08
     */
    import {mixinSchema} from '../../src/mixin';
    import StaticMap from './src/static-map';
    import StaticPlain from './src/static-plain';
    export default {
        mixins: [mixinSchema],
        data() {
            return {
            }
        },
        components: {
            StaticMap,
            StaticPlain
        },
        methods: {
            fen2Yuan(num) {
                if (typeof num !== "number" || isNaN(num)) {
                    return null;
                }
                return (num / 100).toFixed(2);
            }
        },
        render(h) {
            switch (this.schema.type) {
                case 'static-map':
                case 'map':
                    return  <static-map elValue={this.elValue} schema={this.schema}></static-map>
                case 'static-plain':
                case 'plain':
                    return  <static-plain elValue={this.elValue} schema={this.schema}></static-plain>
                case 'static-amount':
                    return  <span>{this.fen2Yuan(this.elValue)}</span>
                default :
                    break;
            }
        }
    }
</script>
