<script lang="jsx">
    /**
     * @file actions.vue
     * @author zengqingzhuang(zengqingzhuang@baidu.com)
     * @since 2017/11/15
     */
    import urlFormat from 'url';
    import _ from 'lodash';
    import flat from 'flat';
    import {mixinSchema} from '../../../src/mixin';
    import apify from '../../../src/request/apify';
    import {getApiData, getPageData} from '../../../src/util/filterObject';
    import executeExpress from '../../../src/util/express';
    import stateHandler from '../../../src/util/stateHandler';
    export default {
        mixins: [mixinSchema],
        props: {
            // 点击按钮操作后执行的回调函数
            callFunc: {
                type: Function
            },
            // 按钮位置left/center/right
            buttonClassName: {
                type: String,
                default: 'right'
            }
        },
        data() {
            return {
                // 是否已发起请求
                isRequest: false
            };
        },
        methods: {
            // 点击事件处理
            actionHandler(schema) {
                // 请求接口之前的数据校验方法
                this.model = flat.unflatten(this.model);
                if (schema.eventName && this.GLOBAL.actionEvents[schema.eventName].call(this) === false) {
                    return;
                }
                if (this.isRequest) return;
                if((schema.actionType === 'ajax' || schema.type === 'submit') && this.callback) { // 调用事件获取数据
                    this.callback((data)=> {
                        if (schema.type === 'submit') { // 表单直接提交数据
                            return this.applyApi(schema, data);
                        }
                        this.actionHandlerSwitch(schema);
                    });
                } else {
                    this.actionHandlerSwitch(schema);
                }
            },
            actionHandlerSwitch(node) {
                switch (node.actionType) {
                    case 'ajax':
                        if (node.confirmText) {
                            this.$confirm(node.confirmText, '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                this.applyApi(node);
                            }).catch((e) => {
                                this.$message({
                                    type: 'info',
                                    message: '已取消操作'
                                });
                            });
                        } else {
                            this.applyApi(node);
                        }
                        break;
                    case 'link':
                        let link = this.getRequestUrl(node.link).url;
                        if (this.isExistRoute(link.split('?')[0])) {
                            this.$router.push(link);    
                        } else {
                            window.location.href = link;
                        }
                        break;
                    case 'url':
                        let url = node.url;
                        if (node.urlTemplate) {
                            url = executeExpress(node.urlTemplate, getPageData({
                                value: this.elValue,
                                pageData: this.model
                            }));
                        }
                        window.open(this.getRequestUrl(url).url);
                        break;
                    case 'dialog':
                        _.assign(node.dialog, {
                            elValue: _.cloneDeep(this.elValue), // 保存数据到vuex，如:表格选中的行数据
                            model: _.cloneDeep(this.model), // 表单数据
                            callback: this.callFunc, // 回调函数
                            visibleDialog: true // 显示弹窗
                        });
                        this.$store.dispatch('dialogInfo', node.dialog);
                        break;
                    case 'cancel': // 关闭弹窗使用
                        this.$store.dispatch('dialogInfo', {visibleDialog: false});
                        break;
                }
            },
            // 发送请求
            applyApi(node, data = {}) {
                let store = this.$store;
                store.dispatch('formDisabled', true);
                if (!node.api) return;
                let apiData = this.getRequestUrl(node.api);
                // 表单提交如果api上未配置参数，则取表单所有数据
                if (node.type === 'submit' && Object.keys(apiData.params).length === 0) {
                    apiData.params = data;
                }
                this.isRequest = true;
                let successMsg = '';
                let failedMsg = '';
                if (node.messages) {
                    successMsg = node.messages.success;
                    failedMsg = node.messages.failed;
                }
                let duration = 3000;
                if (typeof node.duration === 'number') {
                    duration = node.duration;
                }
                apify(apiData.url, apiData.method).initApi(apiData.params).then((res)=> {
                    this.isRequest = false;
                    store.dispatch('formDisabled', false);
                    if (res.status === 0) {
                        // 消息提示
                        !successMsg && (successMsg = res.msg);
                        this.$message({
                            duration: duration,
                            dangerouslyUseHTMLString: true,
                            showClose: true,
                            message: successMsg,
                            type: 'success'
                        });
                        _.assign(this.model, res.data);
                        if (node.redirect) {
                            let redUrl = this.getRequestUrl(node.redirect).url;
                            let pathName = urlFormat.parse(node.redirect).pathname;
                            if (pathName == this.$route.path) { // 当前页面刷新
                                window.location.href = redUrl;
                            } else {
                                this.$router.push(redUrl);
                            }
                        } else if (node.url) { // 重新打开新页签
                            window.open(this.getRequestUrl(node.url).url);
                        } else if (node.reload) { // 操作成功后重新加载指定模块

                        }
                        let dialogInfo = store.state.dialogInfo;
                        if (dialogInfo) {
                            dialogInfo.callback && dialogInfo.callback();
                            if (dialogInfo.visibleDialog) {
                                store.dispatch('dialogInfo', {visibleDialog: false});    
                            }
                        }
                    }
                }).catch(e => {
                    this.isRequest = false;
                    !failedMsg && (failedMsg = e.statusText);
                    this.$message.error(failedMsg);
                    store.dispatch('formDisabled', false);
                });
            },
            // 拼接请求地址数据
            getRequestUrl(url) {
                let value = this.elValue || this.dialogInfo.elValue;
                return getApiData({
                    value: value,
                    pageData: this.model,
                    api: url
                });
            },
            // 判断路由是否存在
            isExistRoute(uri) {
                let isExist = false;
                let routes = this.$router.options.routes;
                let prefix = routes[0].path
                for (let i = 0; i < routes.length; i++) {
                    let route = routes[i];
                    for (let j = 0; j < route.children.length; j++) {
                        if (prefix + '/' + route.children[j].path === uri) {
                            isExist = true;
                            break;
                        }
                    }
                    if (isExist) {
                        break;
                    }
                }
                return isExist;
            }
        },
        render(h) {
            const vm = this;
            let actions = [];
            // schema数据对象为空时阻止渲染
            if (!vm.schema) {
                return;
            }
            // 获取所有按钮
            function getAllBtns(vNodes, type) {
                if (!Array.isArray(vNodes)) {
                    vNodes = [vNodes];
                }
                let btns = [];
                vNodes.forEach(vNode => {
                    let domState = stateHandler({
                        value: vm.elValue,
                        pageData: vm.model,
                        vNode: vNode
                    });
                    // 优先取json配置的disabled值，次之取传入的disabled值，最后取计算出来的disabled值
                    if (vm.disabled && vNode.disabled !== false) {
                        domState.disabled = vm.disabled;
                    }
                    if (domState.visible) {
                        if (vNode.type === "button" || vNode.type === "submit") {
                            btns.push(
                                <el-button
                                    onClick = {vm.actionHandler.bind(this, vNode)}
                                    disabled = {domState.disabled}
                                    size = {vNode.size || 'medium'}
                                    type = {vNode.level || 'primary'}
                                    icon = {vNode.icon}>
                                    { vNode.label }
                                </el-button>
                            )
                        } else if (vNode.type === "button-group") {
                            getAllBtns(vNode.buttons, 'group');
                        }
                    }
                });
                // 按钮组
                if (type === 'group') {
                    return actions.unshift(<el-button-group> {btns} </el-button-group>);    
                }
                actions.unshift(btns);
            }
            getAllBtns(this.schema);
            return (<div class={this.buttonClassName}> {actions} </div>);
        }
    }
</script>
<style type="text/less" lang="less" scoped>
    .left {
        text-align: left;
    }
    .right {
        text-align: right;
    }
    .center {
        text-align: center;
    }
</style>
