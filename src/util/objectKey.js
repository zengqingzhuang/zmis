/**
 * @file objectKey.js
 * @author zengqingzhuang(zengqingzhuang@baidu.com)
 * @description 解析schema，获取页面所有的name、value、type
 * @since 2018/01/26
 */
function parseSchema() {
    this.selectKey = 'controls';
    this.dialogKey = 'dialog';
    this.dataObject = {};
}
parseSchema.prototype = {
    parseObject(schemaObj) {
        Object.keys(schemaObj).forEach(key => {
            let dataKey = schemaObj[key];
            if (key === this.dialogKey) { // 弹窗不一起搜集，需要单独搜集
                return;
            }
            if (Array.isArray(dataKey)) {
                if (key === this.selectKey) {
                    this.getValueNames(dataKey);
                } else {
                    this.parseArray(dataKey);
                }
            } else if (dataKey instanceof Object) {
                if (key === this.selectKey) {
                    this.getValueNames([dataKey]);
                } else {
                    this.parseObject(dataKey);    
                }
            }
        });
    },
    parseArray(array) {
        array.forEach(item => {
            if (Array.isArray(item)) {
                this.parseArray(item);
            } else if (item instanceof Object) {
                this.parseObject(item);
            }
        });
    },
    // 获取name和默认value
    getValueNames(controls) {
        controls.forEach(item => {
            if (Array.isArray(item)) {
                this.getValueNames(item);
            } else if (item instanceof Object) {
                let value = null;
                if (item.type === 'checkboxes') {
                    value = item.value || [];
                } else if (item.value !== undefined) {
                    value = item.value;
                }
                item.name && (this.dataObject[item.name] = value);
            }
        });
    }
};
export default (schema)=> {
    try {
        let schemaObj = new parseSchema();
        if (Array.isArray(schema)) {
            schemaObj.parseArray(schema);
        } else if (schema instanceof Object) {
            schemaObj.parseObject(schema);
        }
        return schemaObj.dataObject;
    } catch(e) {
        console.error(e);
    }
};