<template>
    <div class="el-date-editor el-range-editor el-input__inner el-date-editor--daterange"
         :class="[{'is-disabled': disabled}]"
         style="width:100%; min-width: 170px; overflow: hidden">
        <input
                name="beginValue"
                v-model="beginValue"
                :disabled="disabled"
                :placeholder="placeholder"
                @input="handleInput"
                @focus="handleFocus"
                @blur="handleBlur"
                @change="handleChange"
                autocomplete="off"
                class="el-range-input">
        </input>
        <span class="el-range-separator">-</span>
        <input
                name="endValue"
                v-model="endValue"
                :disabled="disabled"
                :placeholder="placeholder"
                @input="handleInput"
                @focus="handleFocus"
                @blur="handleBlur"
                @change="handleChange"
                autocomplete="off"
                class="el-range-input el-input__inner">
        </input>
    </div>
</template>
<script>
    /**
     * @file finbox/component/date/src/number-range.vue
     * @author yuchao03(yuchao03@baidu.com)
     * @desc 数值范围
     * @since 2017/11/22
     */
    import {mixinSchema} from '../../../src/mixin';
    import _ from 'lodash';
    export default {
        mixins: [mixinSchema],
        inject: {
            elForm: {
                default: ''
            },
            elFormItem: {
                default: ''
            }
        },
        props: {
            value: {
                type:[Array, String],
                default: []
            },
            disabled: {
                type: Boolean,
                default: true
            },
            placeholder: String,
            id: String,
            name: {
                default: ''
            },
            type: {
                type: String,
                default: 'text'
            },
            validateEvent: {
                type: Boolean,
                default: true
            }
        },
        data() {
        return {
            currentValue: this.elValue || [null, null],
            beginValue: null,
            endValue: null,
            rangeErrMessage: '最小值不可大于最大值' // 自定义类型 无法被form接管处理, 需自行处理
        }
    },
    methods: {
        handleInput: _.debounce(function(event) {
            const newValue = event.target.value;
            ({
                beginValue: () => {
                    this.beginValue = this._decrease(newValue, this.currentValue[0]);
                    this.setCurrentValue();
                },
                endValue: () => {
                    this.endValue = this._decrease(newValue, this.currentValue[1]);
                    this.setCurrentValue();
                }
            }[event.target.name])();
        }, 300),
                rangeValidate: function() {
            if(this.beginValue !== null && this.endValue !== null) {
                if(_.toNumber(this.beginValue) > _.toNumber(this.endValue)) {
                    var formItem = this.elFormItem;
                    formItem.validateState = 'error';
                    formItem.validateMessage = this.rangeErrMessage;
                }
            }
        },
        _decrease(val, originVal) {
            if (isNaN(val) || val === null || val === '') {return null;}
            return _.toNumber(val);
        },
        setCurrentValue() {
            if (this.validateEvent) {
                let value = [this.beginValue, this.endValue];
                this.$emit('input', value);
            }
        },
        handleChange(event) {
            this.$emit('change', this.value);
        },
        handleBlur(event) {
            if (this.elFormItem.validateState === 'error' && this.elFormItem.validateMessage === this.rangeErrMessage ) {
                this[event.target.name] = null;
                this.setCurrentValue();
            }
            this.$emit('blur', this.value);
        },
        handleFocus(event) {
            this.$emit('focus', this.value);
        }
    },
    watch: {
        'value'(val, oldVal) {
            this.currentValue = this.value || [null, null],
            this.beginValue = this.currentValue[0];
            this.endValue =  this.currentValue[1];
        },
        beginValue(val, oldVal) {
            this.rangeValidate();
        },
        endValue(val, oldVal) {
            this.rangeValidate();
        }
    }
    };
</script>