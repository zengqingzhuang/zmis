<script lang="jsx">
    /**
     * @file navmenu.vue
     * @author zengqingzhuang(zengqingzhuang@baidu.com)
     * @description 菜单组件，数据格式参考data
     * @since 2017/10/25
     */
    import {mixinSchema} from '../../../src/mixin';
    export default {
        mixins: [mixinSchema],
        props: {
            // 菜单数据
            menuData: {
                type: Array,
                default: []
            },
            // 是否收起menu
            isCollapse: {
                type: Boolean,
                default: false
            },
            // 默认激活地址-不传默认激活当前路由地址
            defaultActive: {
                type: String,
                default: ''
            }
        },
        data() {
            return {

            };
        },
        render(h) {
            let menuList = [];
            this.menuData.forEach(item=> {
                menuList.push(createMenu(item));
            });
            function createMenu(item) {
                let menuChildren = [];
                if (item.children && item.children.length > 0) {
                    menuChildren.push(
                        <el-submenu index={item.name}>
                            <template slot="title">
                                <i class={item.icon}></i><span slot="title">{item.name}</span>
                            </template>
                            {createChildren(item.children)}
                        </el-submenu>
                    )
                } else {
                    menuChildren.push(<el-menu-item index={item.url}><i class={item.icon}></i>{item.name}</el-menu-item>);
                }
                return menuChildren;
            }
            function createChildren(children) {
                let menuChildren = [];
                children.forEach(menu => {
                    if (menu.children && menu.children.length > 0) { // 父节点
                        menuChildren.push(createMenu(menu))
                    } else { // 子节点
                        menuChildren.push(<el-menu-item index={menu.url}><i class={menu.icon}></i>{menu.name}</el-menu-item>);
                    }
                });
                return menuChildren;
            }
            return  <el-menu default-active={this.defaultActive || this.$route.path} router collapse={this.isCollapse}>
                        {menuList}
                    </el-menu>
        }
    };
</script>
<style type="text/less" lang="less">

</style>