<template>
    <div class="fb-upload-image">
        <div class="fb-upload-wrapper" v-if="!disabled||false">
            <vue-dropzone class="vue-dropzone"
                          ref="vueDropZone" id="vue-dropzone"
                          @vdropzone-file-added="handleChange"
                          @vdropzone-file-added-manually="manuallyAddFile"
                          @vdropzone-success="imageUploadFinish"
                          @vdropzone-removed-file="imageRemoved"
                          :options="dropzoneOptions">
            </vue-dropzone>

            <vue-cropper
                    v-loading="loading"
                    v-show="showCropper"
                    class="image-cropper"
                    ref="vueCropper"
                    :img="cropperConfig.img"
                    :outputSize="cropperConfig.size"
                    :outputType="cropperConfig.outputType"
                    :info="cropperConfig.info"
                    :canScale="cropperConfig.canScale"
                    :autoCrop="cropperConfig.autoCrop"
                    :autoCropWidth="cropperConfig.width"
                    :autoCropHeight="cropperConfig.height"
                    :fixed="cropperConfig.fixed"
                    :fixedNumber="cropperConfig.fixedNumber"
            >
            </vue-cropper>
            <div class="image-cropper-btn"
                 v-show="showCropper">
                <i class="el-icon-close" @click="cropCancel"></i>
                <i class="el-icon-check" @click="cropFinish"></i>

            </div>
        </div>

        <div v-else>
            <ul class="el-upload-list el-upload-list--text">
                <li v-if="!value || value.length === 0">
                    暂无
                </li>
                <li v-else v-for="item in value" class="el-upload-list__item is-ready">
                    <a v-if="supportDownload" class="el-upload-list__item-name" :href="item.url" download>
                        <i class="el-icon-document"></i>
                        {{item.name}}
                    </a>
                    <span v-else class="el-upload-list__item-name" :href="item.url">
                        <i class="el-icon-document"></i>
                        {{item.name}}
                    </span>
                </li>
            </ul>
        </div>

        <div class="el-upload-tip">
            <div>{{ schema.desc }}</div>
        </div>

    </div>
</template>

<script>
    /**
     * @file  image
     * @author zengqingzhuang(zengqingzhuang@baidu.com)
     *
     * @since 2017/10/20
     */
    import {mixinSchema} from '../../../src/mixin';
    import vueDropzone from 'vue2-dropzone';
    import vueCropper from 'vue-cropper';

    export default {
        mixins: [mixinSchema],
        data() {
            let config = this.schema;
            let url = config.reciever ? config.reciever : '/access/imageupload';
            if (config.crop && config.crop.aspectRatio) {
                config.crop.aspectRatio = this.calculFixedNumber(config.crop.aspectRatio);
            }
            return {
                activeName: 'image',
                showCropper: false,
                editingFileName: '',
                editingFileType: '',
                url,
                loading: false,
                name: config.name,
                crop: config.crop,
                manuallyAddFileFlag: false,
                fileList: [],
                supportDownload: config.supportDownload,
                dropzoneOptions: {
                    url,
                    acceptedFiles: 'image/*',
                    paramName:'image',
                    params: {
                        category: 'image'
                    },
                    maxFiles: config.maxLength ? config.maxLength : null,
                    resizeWidth: config.compress && config.compressOptions && config.compressOptions.maxWidth ? config.compressOptions.maxWidth : null,
                    resizeHeight: config.compress && config.compressOptions && config.compressOptions.maxHeight ? config.compressOptions.maxHeight : null,
                    resizeMethod: 'crop',
                    thumbnailMethod: 'crop',
                    autoProcessQueue: config.autoUpload === false || config.crop ? false : true,
                    dictDefaultMessage: '<div class="imageUploader">将图片拖入该区域，或者 <span><i class="el-icon-upload"></i>选择文件</span></div>',
                    addRemoveLinks: true,
                    dictRemoveFile: '删除文件',
                    dictCancelUpload: '取消上传',
                    dictMaxFilesExceeded: '上传文件数目超出限制',
                    dictFileTooBig: '上传文件大小超出限制',
                    dictCancelUploadConfirmation: '您确认删除吗？'
                },
                cropperConfig: {
                    info: true,
                    size: 1,
                    outputType: 'jpeg',
                    canScale: false,
                    autoCrop: true,
                    // 开启宽度和高度比例
                    fixed: true,
                    fixedNumber: config.crop && config.crop.aspectRatio ? config.crop.aspectRatio : [1, 1]
                },
                vNodes: this.schema
            }
        },
        components: {
            vueDropzone,
            vueCropper
        },
        methods: {
            // 计算默认的数据比
            calculFixedNumber(aspectRatio) {
                if (typeof aspectRatio === 'number') {
                    let denominator = 1; // 分母
                    let molecular = aspectRatio; // 分子
                    while (molecular % 1 !== 0) {
                        denominator *= 10;
                        molecular *= 10;
                    }
                    return [molecular, denominator];
                } else {
                    return false;
                }
            },
            // 上传结束事件
            imageUploadFinish(file, res) {
                this.updateManuallyAddFile(res.retdata);
            },
            // 删除图片事件
            imageRemoved(file, error, xhr) {
                this.imageRemovedFileValue(file.name);
            },
            // 手动增加文件选项
            manuallyAddFile(file) {
                this.manuallyAddFileFlag = false;
            },
            // 文件上传选项
            handleChange(file) {
                let uploadedFiles = this.$refs.vueDropZone.dropzone.files;
                if (uploadedFiles.length > this.schema.maxLength) {
                    this.$message.error('超出上传文件数量限制' + this.schema.maxLength);
                    this.$refs.vueDropZone.removeFile(file);
                    return;
                }
                if (this.schema.maxSize) {
                    if (file.size - this.schema.maxSize >= 0) {
                        this.$message.error('您传入的文件过大，请重新上传');
                        this.$refs.vueDropZone.removeFile(file);
                        return;
                    }
                }
                if (this.crop && !this.manuallyAddFileFlag) {
                    this.editingFileName = file.name;
                    this.editingFileType = file.type;
                    let reader = new FileReader();
                    reader.onload = (e) => {
                        let data;
                        if (typeof e.target.result === 'object') {
                            // 把Array Buffer转化为blob 如果是base64不需要
                            data = window.URL.createObjectURL(new Blob([e.target.result]))
                        } else {
                            data = e.target.result
                        }
                        this.cropperConfig.img = data;
                        this.$refs.vueDropZone.removeFile(file);
                        this.showCropper = true;
                    };
                    // 转化为blob
                    reader.readAsArrayBuffer(file);
                }
            },
            // 裁剪结束选项
            cropFinish() {
                // 输出
                this.$refs.vueCropper.getCropBlob(data => {
                    let xhr = new XMLHttpRequest();
                    xhr.open('post', this.url, true);
                    let headers = {
                        "Accept": "application/json",
                        "Cache-Control": "no-cache",
                        "X-Requested-With": "XMLHttpRequest"
                    };
                    for (let headerName in headers) {
                        let headerValue = headers[headerName];
                        if (headerValue) {
                            xhr.setRequestHeader(headerName, headerValue);
                        }
                    }

                    let formData = new FormData();
                    formData.append('image', data, this.editingFileName);
                    formData.append('category', 'image');
                    xhr.onload = e => {
                        if (xhr.status == 200 || xhr.status == 304) {
                            let res = xhr.response.retdata;

                            let file = {name: res.filename};
                            let url = res.url;

                            this.showCropper = false;
                            this.manuallyAddFileFlag = true;
                            this.loading = false;

                            this.$refs.vueDropZone.manuallyAddFile(file, url);
                            this.updateManuallyAddFile(res);
                        }
                    };
                    xhr.send(formData);
                    this.loading = true;
                })
            },
            // 取消裁剪
            cropCancel() {
                this.$refs.vueCropper.stopCrop();
                this.showCropper = false;
                this.$message.error('取消成功');
            },
            // 更新删除文件之后的fileValue
            imageRemovedFileValue(fileName) {
                for (let i = 0; i < this.fileList.length; i++) {
                    let item = this.fileList[i];
                    if (item.filename === fileName) {
                        this.fileList.splice(i, 1);
                        if (this.fileList.length === 0) {
                            this.model[this.schema.name] = null;
                        } else {
                            this.model[this.schema.name] = this.fileList;
                        }
                        return;
                    }
                }
            },
            // 更新手动添加文件的value
            updateManuallyAddFile(file) {
                this.fileList.push(file);
                this.model[this.schema.name] = this.fileList;
            }
        },
        mounted() {
            this.$nextTick(() => {
                if (this.value && Array.isArray(this.value) && !this.disabled) {
                    this.value.forEach(item => {
                        this.manuallyAddFileFlag = true;
                        this.$refs.vueDropZone.manuallyAddFile({name: item.filename}, item.url);
                        this.updateManuallyAddFile(item);
                    });
                }
            })
        }
    }
</script>

<style lang="less">

    .fb-upload-image {
        .fb-upload-wrapper {
            position: relative;
            .vue-dropzone {
                display: table;
                position: relative;
                padding: 0;
                width: 100%;
                height: 70px;
                min-height: 70px;
                cursor: pointer;
                font-size: 16px;
                line-height: 1.6;
                border: 2px dashed #cfdadd;
                text-align: center;
                color: #99a6ad;
                .imageUploader {
                    display: table-cell;
                    vertical-align: middle;
                    span {
                        float: none;
                        padding: 5px 10px;
                        margin: 0 0 0 10px;
                        outline: 0;
                        line-height: 1.5;
                        font-size: 12px;
                        border-color: #23b7e5;
                        font-weight: 500;
                        border-radius: 2px;
                        color: #fff;
                        background-color: #23b7e5;

                        i {
                            color: #fff;
                        }
                    }
                }
                .dz-image-preview {
                    float: left;
                }
            }
            .image-cropper {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                width: 100%;
                z-index: 40;
            }
            .image-cropper-btn {
                position: absolute;
                right: 10px;
                bottom: 10px;
                z-index: 50;
                i {
                    display: block;
                    font-size: 24px;
                    font-weight: bold;
                }
                .el-icon-check {
                    color: #fad733;
                }
                .el-icon-close {
                    color: #fff;
                }
            }
        }

        .el-upload-tip {
            margin-top: 0;
            margin-bottom: 10px;
            color: #737373;
            div {
                font-size: 16px;
                line-height: 1.6;
                word-wrap: break-word;
            }
        }
        .el-upload-list__item {
            a {
                text-decoration: none;
            }
        }

    }


</style>
