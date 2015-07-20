define(['BaseView', "cUIInputClear","cUIImageSlider" ,"Model", "Store","UIGroupSelect","text!TplPersonal"], function (BaseView, cUIInputClear,cUIImageSlider, Model, Store,UIGroupSelect,tplPersonal) {
    var self;
    var View = BaseView.extend({
        ViewName: 'personal.',
        events: {
            "click .housing .btn": "toReserve",
            "click .location_icon": "toLocation",
            "click .search-btn": "toSearch",
            "click .personal .opt-list .name": "toUpdateName",
            "click #confirm-btn": "ensureName",
            /*"click .personal .opt-list .gender":"toUpdateGender",*/
            "click .personal .opt-list .pwd": "toUpdatePwd",
            //"click .personal .opt-list .tel":"toUpdateTel",
            "click .gender-box div": "selectGender",
            "click .loginout": "loginout",
            "click .avatar-box ": "modifyPic",//选择修改头像
            "click  .pic-box .cancel": "cancelEditing",
            "click #choose-box": "readFile",//选择相册
            "click #camera": "camera",//拍照
            "click .exit": "exit"
        },
        exit: function () {
            navigator.app.exitApp();
        },
        toUpdateTel: function () {
            self.$el.find(".personal").addClass("tel-active");
            self.setTelHeader();
        },
        camera: function (e) {
            self.iframeContent.contentWindow.getPictureFromCamera(function(data){
                $('#picture').attr('src','data:image/jpeg;base64,'+data);
                self.cancelEditing();
                self.uploadPicture(data);
            })
        },
        //点击选择相册
        readFile: function (e) {
            self.iframeContent.contentWindow.getPictureFromPhoto(function(data){
                $('#picture').attr('src','data:image/jpeg;base64,'+data);
                self.cancelEditing();
                self.uploadPicture(data);
            })

            //var self=this;
            //var self=this;
            //    file = e.currentTarget.files[0];
            //if(!/image\/\w+/.test(file.type)){
            //    alert("请确保文件为图像类型");
            //    return false;
            //}
            //var reader = new FileReader();
            //reader.readAsDataURL(file);
            //reader.onload = function(e) {
            //    //self.$el.find(".avatar")[0].src = this.result;
            //    self.cancelEditing();
            //}

        },
        uploadPicture:function(data){
            self.showLoading();
            var url = Lizard.host + Lizard.apiUrl + "renters/"+self.user.actor_id+"/save_avatar?auth_token="+ self.user.authentication_token;
            $.ajax({
                url: url,
                type: "POST",
                data:{ "avatar" : 'data:image/jpeg;base64,' + data },
                success: function (data) {
                    self.hideLoading();
                    self.showMyToast("上传成功", 2000);
                    self.login();
                },
                error: function (e) {
                    self.hideLoading();
                    self.showMyToast("服务器异常", 1000);
                }
            });

        },
        cancelEditing: function (e) {
            this.$el.find(".pic-box").hide();
        },
        modifyPic: function (e) {
            this.$el.find(".pic-box").show();
        },
        loginout: function (e) {
            var user = self.getCurrentUser();
            self.showLoading();
            var url = Lizard.host + Lizard.apiUrl + "users/" + user.id;
            $.ajax({
                url: url,
                type: "DELETE",
                success: function (data) {
                    self.hideLoading();
                    if (data.success) {
                        self.setLoginStatus({});
                        Lizard.goTo("login.html");
                    }
                },
                error: function (e) {
                    self.hideLoading();
                    self.showMyToast("服务器异常", 1000);
                }
            });
        },

        modifyPwd: function (e) {
            var oldPwd = $.trim(self.$el.find(".pwd_box .old-password").val());
            if (!oldPwd) {
                self.showMyToast("请入原来的密码", 1000);
                return
            }
            var newPwd = $.trim(self.$el.find(".pwd_box .new-password").val());
            if (!newPwd) {
                self.showMyToast("请入密码", 1000);
                return
            }
            if (newPwd.length < 8) {
                this.showMyToast("密码至少8位", 1000);
                return;
            }
            var confirmPwd = $.trim(self.$el.find(".pwd_box .confirm-password").val());
            if (!confirmPwd) {
                self.showMyToast("请入确认密码", 1000);
                return
            }
            if (confirmPwd != newPwd) {
                self.showMyToast("密码与确认密码不一致", 1000);
                return
            }
            var user = self.getCurrentUser();
            self.showLoading();
            var url = Lizard.host + Lizard.apiUrl + "users/" + user.id;
            $.ajax({
                url: url,
                type: "PUT",
                data: {cell: user.cell, password: newPwd, auth_token: user.authentication_token},
                success: function (data) {
                    self.hideLoading();
                    if (data.message == "success") {
                        self.$el.find(".personal").removeClass("pwd-active");
                        self.setHeader();
                        self.showMyToast("修改密码成功！", 1000);
                    }

                },
                error: function (e) {
                    self.hideLoading();
                    self.showMyToast("服务器异常", 1000);
                }
            });


        },

        setTelHeader: function () {
            self.header.set({
                title: '手机号码',
                back: true,
                backtext: '取消',
                view: this,
                btn: {
                    title: '保存',
                    id: 'confirm-btn',
                    classname: 'right_btn'
                },
                events: {
                    returnHandler: function () {
                        self.$el.find(".personal").removeClass("tel-active");
                        self.setHeader();
                    },
                    commitHandler: function () {

                    }
                }
            });

        },


        selectGender: function (e) {
            var target = $(e.currentTarget);
            self.$el.find(".gender-box div").each(function () {
                $(this).removeClass("selected");
            })
            target.addClass("selected");
        },

        toUpdatePwd: function () {
            self.$el.find(".personal").addClass("pwd-active");
            self.setpwdHeader();
        },
        setpwdHeader: function () {
            self.header.set({
                title: '修改密码',
                back: true,
                backtext: '取消',
                view: this,
                btn: {
                    title: '保存',
                    id: 'confirm-btn',
                    classname: 'right_btn'
                },
                events: {
                    returnHandler: function () {
                        self.$el.find(".personal").removeClass("pwd-active");
                        self.setHeader();
                    },
                    commitHandler: function () {
                        self.modifyPwd();
                    }
                }
            });
        },


        /* toUpdateGender:function() {
         self.$el.find(".personal").addClass("gender-active");
         self.setGenderHeader();

         },*/
        /*setGenderHeader:function() {
         self.header.set({
         title: '性别',
         back: true,
         backtext: '取消',
         view: this,
         btn: {
         title: '保存',
         id: 'confirm-btn',
         classname: 'right_btn'
         },
         events: {
         returnHandler: function () {
         self.$el.find(".personal").removeClass("gender-active");
         self.setHeader();
         },
         commitHandler: function () {

         }
         }
         });

         },*/
        toUpdateName: function () {
            self.$el.find(".personal").addClass("name-active");
            self.setNameHeader();
        },
        setNameHeader: function () {
            self.header.set({
                title: '名字',
                back: true,
                backtext: '取消',
                view: this,
                btn: {
                    title: '保存',
                    id: 'confirm-btn',
                    classname: 'right_btn'
                },
                events: {
                    returnHandler: function () {
                        self.$el.find(".personal").removeClass("name-active");
                        self.setHeader();
                    },
                    commitHandler: function () {
                        self.ensureName();
                    }
                }
            });
        },
        //
        ensureName: function () {

            self.showLoading();
            var url = Lizard.host + Lizard.apiUrl + "renters/" + self.getCurrentUser().actor_id;
            $.ajax({
                url: url,
                type: "PUT",
                dataType: "json",
                data: {
                    "renter[nick_name]": self.$el.find(".name-box .name").val(),
                    auth_token: self.getCurrentUser().authentication_token
                },
                success: function (data) {
                    self.hideLoading();
                    self.showMyToast("修改成功！", 1000);

                    self.login();
                },
                error: function (e) {
                    self.hideLoading();
                    self.showMyToast("服务器异常", 1000);
                }
            });
        },

        login: function () {
            var url = Lizard.host + Lizard.apiUrl + "users/login";
            $.ajax({
                url: url,
                dataType: "json",
                type: "post",
                data: {cell: self.getCurrentUser().cell, password: self.getCurrentUser().pwd},
                success: function (data) {
                    self.hideLoading();
                    if (data.error) {

                        return
                    }
                    if (data.user) {
                        data.user.token = data.token;
                        data.user.nick_name = data.nick_name;
                        data.user.avatar = data.avatar;
                        data.user.pwd = self.getCurrentUser().pwd;
                        self.setLoginStatus({isLogin: true, user: data.user, token: data.token});

                        Lizard.goTo("personal.html");

                    }

                },
                error: function (e) {
                    self.hideLoading();
                    self.showMyToast("服务器异常", 1000);
                }
            });
        },

        selectDate: function (e) {
            self.dateScroller.show();
        },
        toReserve: function (e) {
            self.$el.find(".info_ct").hide();
            self.$el.find(".housing").hide();
            self.$el.find(".reserve_ct").show();
        },
        ajaxException: function (msg) {
            self.loginBtn.html("登录");
            self.hideLoading();
            self.showMyToast('网络错误，请重试', 2000);
        },

        afterIframeLoad:function() {
            var iDoc = self.iframeContent.contentDocument || self.iframeContent.document;

            self.hideLoading();


        },

        onCreate: function () {
            self = this;
            self.$el.html(tplPersonal);
        },
        onShow: function () {
            self.setHeader();
            self.user=self.getCurrentUser();
            self.$el.html(_.template(tplPersonal)({
                user: {
                    nick_name: self.user.nick_name,
                    cell: self.user.cell
                }
            }));
            if (!self.iframeContent) {
                var iframe = document.createElement("iframe");
                iframe.width = "100%";
                iframe.height ="0";
                iframe.src = "./camera.html";
                iframe.frameBorder = "0";
                iframe.frameBorder = "no";
                iframe.scrolling = "no";
                iframe.border = "0";
                if (navigator.userAgent.indexOf("MSIE") > -1 && !window.opera) {
                    iframe.onreadystatechange = function() {
                        if (iframe.readyState == "complete") {
                            self.afterIframeLoad();
                        }
                    };
                } else {
                    iframe.onload = function() {
                        self.afterIframeLoad();
                    };
                }
                self.$el.append(iframe);
                self.iframeContent = iframe;
            }else{
                self.hideLoading();
            }
            self.$el.find("#picture").attr("src",user.avatar.avatar.url);

        },
        //设置标题
        setHeader: function () {
            self.header.set({
                title: '个人信息',
                back: true,
                backtext: '<i class="icon-back "></i> ',
                view: this,

                events: {
                    returnHandler: function () {
                        Lizard.goTo("user.html");
                    },
                    commitHandler: function () {

                    }
                }
            });
        },
        onHide: function () {

        }
    });

    return View;
})
