/**
 * @file schema.js
 * @author zengqingzhuang(zengqingzhuang@baidu.com)
 * @desc 数据对象管理
 * @since 2018/02/22
 */
import {mapState} from 'vuex';

export default {
    props: {
        // 接收v-model值
        value: {
            type: Object | String | Array
        },
        // 组件默认值
        elValue: {
            type: Object | String | Array
        },
        // json配置
        schema: {
            type: Object | String | Array
        },
        // 回调函数
        callback: {
            type: Function
        },
        // true不可用，false可用
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            vNodes: Array.isArray(this.schema) ? this.schema : [this.schema],
            model: this.value || {}
        };
    },
    watch: { // 当循环遍历调用一个组件的时候，如果传入的schema/value不同,接受值需要更新
        schema: {
            handler(val) {
                this.vNodes = Array.isArray(this.schema) ? this.schema : [this.schema];
            },
            deep: true
        },
        value: {
            handler(val) {
                this.model = val;
            },
            deep: true
        }
    },
    computed: {
        formData() {
            return {};
        },
        ...mapState(['globalData', 'dialogInfo'])
    }
};
