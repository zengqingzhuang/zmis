
<script lang="jsx">
/**
 * @file select-async.vue
 * @author jiamiao(jiamiao@baidu.com)
 * @desc 远程加载选项
 * @since 2017
 * @param {array} triggerTarget 需要监听的参数，不传则监听source后带$的所有参数
 * @param {array} nonEmptyDepend 强依赖的参数，不为空时才去请求
 * @param {boolean} remote 区分是否开启select的模糊搜索，默认为false
 * @param {int} debouncedTime 防抖时间，默认为300ms
 * @param {string} queryAlise 模糊搜索把query传给接口的key值，默认为query
 * @param {obj} optionAliseMap options中展示的label和value在接口中实际的值
 * @param {boolean} clearable select中的值是否可以删除，默认是false
 */
import Vue from 'vue';
import _ from 'lodash';
import queryString from 'query-string';
import {mixinSchema} from '../../../src/mixin';
import apify from  '../../../src/request/apify';
import {getElValue} from '../../../src/util/modelObject';
import {getApiData} from '../../../src/util/filterObject';
import FbLoading from '../../../component/loading';
export default {
    mixins: [mixinSchema],
    data() {
        return {
            options: '',
            debouncedTime: this.schema.debouncedTime || 300,
            queryAlise: this.schema.queryAlise || 'query',
            // 强依赖的筛选项是否为空，是否需要请求
            nonEmptyDependFlag: true,
            // 存储model上一次的值
            lastModel: ''
        };
    },
    components: {
        FbLoading
    },
    computed:{
        sourceParsed: function() {
            const SOURCE = this.schema.source;
            if (!SOURCE) return {};
            if (SOURCE instanceof Object) {
                return SOURCE.data || {};
            }
            const sourceSearch = SOURCE.includes('?') ? SOURCE.substring(SOURCE.indexOf('?'), SOURCE.length) : '';
            const parsed = queryString.parse(sourceSearch);
            return parsed;
        }
    },
    created() {
        const vm = this;
        // created的时候给lastModel赋初始值
        vm.cloneModelOderbySetLastModel();
        let nonEmptyDepend = vm.schema.nonEmptyDepend;
        // 初始加载的时候允许配一个waitSeconds参数，防止抢资源，有间隔的请求
        const waitSeconds = parseInt(vm.sourceParsed.waitSeconds || '1') * 1000;
        // 如果初始强依赖为空则不去请求，包括自己本身
        this.judgeDependFlag(nonEmptyDepend);
        if (this.nonEmptyDependFlag) { // 无依赖
            setTimeout(() => {
                vm.getData().then(function(){
                    if (vm.elValue !== null) {
                        vm.model[vm.schema.name] = vm.elValue;
                    }
                });
            }, waitSeconds);
        }
        else {
            vm.$set(vm, 'options', []);
        }
    },
    methods:{
        // 判断强依赖的筛选项有无空
        judgeDependFlag: function(nonEmptyDepend) {
            const vm = this;
            // 判断强依赖的筛选框是否为空，这边由于组件只初始化一次，所以nonEmptyDependFlag这个boolean变量要true、false来回切
            if (nonEmptyDepend) {
                nonEmptyDepend.forEach(function(depend) {
                    if (!getElValue(vm.model, {name: depend})) {
                        vm.nonEmptyDependFlag = false;
                    }
                    else {
                        vm.nonEmptyDependFlag = true;
                    }
                });
            }
        },
        // 由于是对象，直接等于的话会指向内存中的值，会跟着改变而改变，所以需要clone一份
        cloneModelOderbySetLastModel: function() {
            this.lastModel = _.cloneDeep(this.model);
        },
        focusSelect: function() {
            this.options = [];
        },
        remoteMethod: function(value) {
            const vm = this;
            (_.debounce(function(){
                if (value) {
                    vm.getData(value);
                }
            }, vm.debouncedTime))();
        },
        getData(query) {
            const vm = this;
            let params = {};
            // 模糊查询关键字，若定义了queryAlise则用配置的字段请求，默认为query
            params[vm.queryAlise] = query;
            let api = getApiData({
                pageData: vm.model,
                api: vm.schema.source 
            });
            return apify(api.url, api.method).initApi(params).then(function(res){
                let options =  res.data;
                // 若必传参数没传导致接口报错，则options为空
                if (!options) {
                    vm.$set(vm, 'options',[]);
                    return;
                }
                // 若schema中有optionAliseMap，则改变接口数据，加一个默认的label、value键值
                const optionAliseMap = vm.schema.optionAliseMap;
                if (optionAliseMap) {
                    Object.keys(optionAliseMap).forEach(key => {
                        const defaultKey = optionAliseMap[key];
                        options.forEach(option => {
                            option[defaultKey] = option[key];
                        });
                    });
                }
                vm.$set(vm, 'options',(vm.schema.options||[]).concat(options));
            });
        }
    },
    watch: {
        model: {
            // 不知道为什么，这里的new和old是一样的，为了得到改变前后的对象，用了一些hack的方法
            handler(newValue, oldValue) {
                let vm = this;
                let newArr = Object.keys(newValue);
                // 比较这次的和上次的model，得到变化组件的name
                let diffName = newArr.find(i=>{return newValue[i] !== vm.lastModel[i]});
                let monitorParam = [];
                let parsedKeyArr = Object.keys(vm.sourceParsed);
                parsedKeyArr.length > 0 && parsedKeyArr.forEach(i => {
                    if (vm.sourceParsed[i].startsWith('$')) {
                        let monitorItem = vm.sourceParsed[i].slice(1);
                        monitorParam.push(monitorItem);
                    }
                });
                if (monitorParam.length > 0) {
                    monitorParam.forEach(function(item) {
                        if (item === diffName) {
                            // 重要！！下面的两个赋值顺序不能颠倒，因为watch中逻辑是认为model中只会有一个值改变
                            // 赋给lastModel这个时候的this.model
                            vm.cloneModelOderbySetLastModel();
                            // 清空自身的vlaue
                            vm.model[vm.schema.name] = null;
                            vm.getData();
                        }
                    });
                }
            },
            deep: true
        }
    },
    render(h) {
        const vm = this;
        let fbInput = <fb-loading></fb-loading>

        if((vm.options && vm.options.length)) {
            let selectOptions=[];
            vm.options instanceof Array &&
            vm.options.map(function(option, index) {
                selectOptions.push(<el-option
                key={option.value}
                label={option.label}
                value={option.value}
                disabled={option.disabled}></el-option>);
            });
            if(vm.schema.remote && vm.schema.source) {
                fbInput = <el-select
                class="sheet-el-select-async"
                multiple={vm.schema.multiple||false}
                disabled={vm.disabled}
                placeholder={vm.schema.placeholder||'请选择'}
                v-model = {vm.model[vm.schema.name]}
                remoteMethod = {vm.remoteMethod}
                onFocus={vm.focusSelect}
                filterable
                remote
                clearable={vm.schema.clearable||false}>
                {selectOptions}
                </el-select>;
            }
            else {
                fbInput = <el-select
                class="sheet-el-select-async"
                multiple={vm.schema.multiple||false}
                disabled={vm.disabled}
                placeholder={vm.schema.placeholder||'请选择'}
                v-model = {vm.model[vm.schema.name]}
                clearable={vm.schema.clearable||false}>
                {selectOptions}
                </el-select>;
            }


        } else if(vm.options) {

            if(vm.schema.remote && vm.schema.source) {
                fbInput = <el-select
                class="sheet-el-select-async"
                multiple={vm.schema.multiple||false}
                disabled={vm.disabled}
                placeholder={vm.schema.placeholder||'请选择'}
                v-model = {vm.model[vm.schema.name]}
                remoteMethod = {vm.remoteMethod}
                filterable
                remote
                clearable={vm.schema.clearable||false}>
                </el-select>;
            }
            else {
                fbInput = <el-select
                class="sheet-el-select-async"
                multiple={vm.schema.multiple||false}
                disabled={vm.disabled}
                placeholder={vm.schema.placeholder||'请选择'}
                v-model = {vm.model[vm.schema.name]}
                clearable={vm.schema.clearable||false}>
                </el-select>;
            }
        }
        return (<div>{fbInput}</div>);
    }
}

</script>

<style type="text/less">

  .sheet-el-select-async {
      width: 100%;
  }

</style>

