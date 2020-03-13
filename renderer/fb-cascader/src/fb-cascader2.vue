
<script lang="jsx">
/**
* @file fb-cascader.vue
* @author yuchao03(yuchao03@baidu.com)
* @desc 级联选择器
* @since 2017
*/


import queryString from 'query-string';
import {mixinSchema} from '../../../src/mixin';
import apify from  '../../../src/request/apify';
import {getApiData} from '../../../src/util/filterObject';
import FbLoading from '../../../component/loading';


export default {
    mixins: [mixinSchema],
    props: {
    },
    data() {
        return {
        };
    },
    components: {

    },
    methods: {
        inputEvnet(value) {
          //  this.$emit('input', value);
        }
    },

    computed:{
        sourceParsed: function() {
            const SOURCE = this.schema.source;
            const sourceSearch = SOURCE.includes('?') ? SOURCE.substring(SOURCE.indexOf('?'), SOURCE.length) : '';
            const parsed = queryString.parse(sourceSearch);
            return parsed;
        }
    },
    created(){
        const vm = this;

        // 更新到modelKey
       // !vm.elValue && vm.schema.value && (vm.updateForm(vm.schema.name, vm.schema.value), vm.elValue = vm.schema.value);


        // 选项数据
        const SOURCE = vm.schema.source;
        if(vm.schema.source) {
            const SOURCE_SEARCH = SOURCE.substring(SOURCE.indexOf('?'),SOURCE.length);
            const parsed =  queryString.parse(SOURCE_SEARCH);


            let monitorParam = [];
            let parsedKeyArr = Object.keys(vm.sourceParsed);
            parsedKeyArr.length > 0 && parsedKeyArr.forEach(i => {
                if (vm.sourceParsed[i].startsWith('$')) {
                    monitorParam.push(i);console.log(monitorParam);
                }
            });
            if (monitorParam.length > 0) {
                monitorParam.forEach(function(item) {
                    // 监控字段
//                    vm.$watch('modelKeys.' + item, function() {
//                        // 监控参数改变，原本选中的值清除，modelKeys中的值清除
//                        vm.elValue = null;
//                        vm.updateForm(vm.schema.name, null);
//                        getData();
//                    });
                });
            }

            function getData() {
                // 延迟处理
                const waitSeconds = parseInt(parsed.waitSeconds || '0') * 1000;
                let params = {};
                // 获取监控字段值
                parsed.type && parsed.type.split('|').forEach(function(item){
                    params[item] = vm.model[item];
                });
                let api = getApiData({
                    pageData: vm.model,
                    api: vm.schema.source
                });
                setTimeout(function(){
                    apify(api.url).initApi(params).then(function(res){
                        let options = [];
                        if(Array.isArray(res.data)) {
                            options = res.data;
                            vm.$set(vm.schema, 'options', options);
                            return;
                        }
                        console.warn('fb-cascader:source options数据源 data必须为数组！');
                    });
                },waitSeconds);
            }

            getData();
        }
    },
    render(h){

        const vm = this;
        // 对链式key进行取值, modelKeys中包含真正的json结构
       // vm.elValue = this.value;
      //  console.log(this.value);

       // if(vm.schema.options) {
            return <el-cascader
                        style="width:100%"
                        options= {vm.schema.options || []}
                        onInput= {vm.inputEvnet}
                        changeOnSelect = {vm.schema.changeOnSelect || false}>
                    </el-cascader>
      //  } else {

      //  return null;
   // }


}
}

</script>
