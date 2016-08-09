var App = App || {};
define([
    'uview',
    'text!tpl/u_reports.html',  //填写服务报告页面
    'utopbar2',
    'store'
], function (uview, tpl, utopbar, store) {
    var v = uview.extend({
        template: tpl,
        components: {
            "com-utopbar2": utopbar
        },
        objectExtend: {
            cxName: 'ureport',
            cxId: '#u_report',
            cxWpid: '#u_report',
            cxApi: '/v2/user/GetAddServiceReportInfo',
            store: null,
            cxAutoload: true,
            cxAutoShow: true,
            imgdata: '',
            type: 0,        //before or after
            bt_id: '',      //div id
            isnew: 0,       //change img/add img
            cxInit: function () {
                App.footbar(false);
            },
            cxReady: function () {

            },
            cxCreated: function () {
                this.store = new store('report');
                this.cxVas = this.store.get('report');

            }
        },
        cxData: {
            transitionName: 'cxpRight'
        },
        methods: {
            device: function () {
                this.deviceid = this.selected;
            },
            savebtn: function (id) {
                var _this = this;
                if (id == 1) {
                    if (this.listbefore == null)
                        this.listbefore = [];
                    if (this.listafter == null)
                        this.listafter = [];
                }
                if ((!this.listbefore || !this.listafter || this.listafter.length==0 || this.listbefore.length==0) && id == 2) {
                    App.alert("报告不完整");
                } else {
                    if (this.listbefore.length > this.listafter.length) {
                        App.alert('请上传服务后图片');
                    } else if (this.listbefore.length < this.listafter.length) {
                        App.alert('请上传服务前图片');
                    } else {
                        App.upData({
                            url: App.config.urlPath + '/v2/user/GetAddServiceReportInfoaa?' + App.config.accompany,
                            data: {
                                submitstate: id,
                                id: this.id,
                                deviceid: this.deviceid,
                                testresult: this.testresult,
                                recommend: this.recommend,
                                beforeserviceimgs: JSON.stringify(this.listbefore),
                                afterserviceimgs: JSON.stringify(this.listafter)
                            },
                            success: function (data) {
                                if (data.state == 1) {
                                    window.history.back();
                                } else {
                                    if (data.errordes == "") {
                                        App.alert(data.result.info);
                                    } else {
                                        App.alert(data.errordes);
                                    }
                                }
                            }
                        });
                    }
                }

            },
            imgupload: function (type, id, isnew) {
                if (this.submitstate != 2) {
                    $('#file').click();
                    this.type = type;
                    this.bt_id = id;
                    this.isnew = isnew;
                }
            },
            imgchange: function () {
                var _this = this;
                var id = this.bt_id.split('-')[1];
                var file = document.getElementById('file').files[0];
                var image = document.getElementById("imgs");
                var reader = new FileReader();
                //filesize = file.size / 1024 >> 0;

                // if (filesize > 3050) {
                //     App.alert("图片文件过大！");
                //     $('#file').val('');
                // } else {
                canvas = document.createElement("canvas");
                var ctx = canvas.getContext('2d');

                reader.addEventListener("load", function () {
                    _this.imgdata = reader.result;
                    image.src = reader.result;
                    var MAX_HEIGHT = 100;
                    if (image.height > MAX_HEIGHT) {
                        image.width *= MAX_HEIGHT / image.height;
                        image.height = MAX_HEIGHT;
                    }
                    canvas.width = image.width;
                    canvas.height = image.height;
                    ctx.drawImage(image, 0, 0, image.width, image.height);
                    _this.testdata = canvas.toDataURL("image/jpeg", 0.05);
                    _this.imgupdate(id);
                }, false);
                //}
                if (file) {
                    reader.readAsDataURL(file);
                }

            },
            imgupdate: function (id) {
                var _this = this;
                if (this.listbefore == null)
                    this.listbefore = [];
                if (this.listafter == null)
                    this.listafter = [];
                $.ajax({
                    url: App.config.urlPath + '/v2/user/ServiceReportPic?ext=jpg&' + App.config.accompany,
                    type: 'POST',
                    contentType: 'image/jpeg',
                    dataType: 'json',
                    data: _this.imgdata,
                    success: function (data) {
                        console.log(data.result.info);
                        if (data.state == 1) {
                            if (_this.type == 0 && id) {
                                if (_this.listbefore[id])
                                    _this.listbefore[id].imgurl = data.result.info;
                                else
                                    _this.listbefore.push({ "imgurl": data.result.info });
                            } else if (_this.type == 1 && id) {
                                if (_this.listafter[id])
                                    _this.listafter[id].imgurl = data.result.info;
                                else
                                    _this.listafter.push({ "imgurl": data.result.info });
                            } else if (_this.type == 0 && !id) {
                                _this.listbefore.push({ "imgurl": data.result.info });
                            } else if (_this.type == 1 && !id) {
                                _this.listafter.push({ "imgurl": data.result.info });
                            }
                            setTimeout(function () {
                                _this.vScroll.refresh();
                            }, 100);
                        } else {
                            if (data.errordes == "") {
                                App.alert(data.result.info);
                            } else {
                                App.alert(data.errordes);
                            }
                        }
                        $('#file').val('');
                    },
                    error: function () {
                        App.alert("图片上传失败");
                        $('#file').val('');
                    }
                });
            }
        }
    });
    return v;
})
