define(['BaseView', "cUIInputClear", "Model", "Store", "text!TplRegister"], function (BaseView, cUIInputClear, Model, Store, TplRegister) {
    var self;
    var time1=0;
    var View = BaseView.extend({
            ViewName: 'register',
            events: {
                "click  .btn_link1": "toSignIn",
                "click .submit": "toReg",
                "click .btn_get_password": "toResetPsw",
                "click .favourite":"toFavorite",
                "click .mine" :"toUserCenter",
                "click .rent":"toRent",
                "click .login_btn":"toLogin",
                "click .bottom-bar .rent":"toRent",
                "click .bottom-bar .mine":"toPersonal",
                "click .bottom-bar .order":"toOrderList",
                //"click .bottom-bar .schedule":"toSchedule",
                "click .login_box  #VerifyCode  .btn": "getCode"
            },
            showMyToast: function (msg, time) {
                self.showToast({
                    datamodel: {
                        content: msg
                    },
                    maskToHide: false,
                    hideSec: time
                });
            },
        getCode:function(e){
            var mobile = $.trim(this.$el.find(".username").val());
            if (!mobile) {
                this.showMyToast("请输入手机号", 1000);
                return;
            }
            if( !/^(1[3-8][0-9])\d{8}$/.test(mobile)){
                this.showMyToast("请输入正确的手机号", 1000);
                return;
            }

            var time2=new Date().getTime();
            var time3=time2-time1;
            var time4=60-parseInt(time3/1000);
            if(time3<60000&&time3!=0){
                self.showMyToast("请"+time4+"秒后再获取短信", 1000);
                return;
            }
            self.showLoading();
            var url = Lizard.host+Lizard.apiUrl+"users/generate_verification_code";
            $.ajax({
                url: url,
                dataType: "json",
                type: "Post",
                data: {cell: mobile},
                success: function (data) {
                    self.hideLoading();
                    time1=new Date().getTime();
                    self.showMyToast("短信已发送", 1000);

                },
                error: function (e) {
                    self.hideLoading();
                    self.showMyToast("网络错误", 1000);
                }
            });
            //

        },
            toLogin:function(e){
                Lizard.goTo("login.html");
            },
            //toRent:function(e){
            //    self.toggleSideBar();
            //    Lizard.goTo("list.html");
            //},
            toReg: function (e) {

                var mobile = $.trim(this.$el.find(".username").val());
                if (!mobile) {
                    this.showMyToast("请输入手机号", 1000);
                    return;
                }

                if (!this.isMobile(mobile)) {
                    this.showMyToast("手机号码不正确", 1000);
                    return;
                }
                var password = $.trim(this.$el.find(".password").val());
                if (!password) {
                    this.showMyToast("请输入密码", 1000);
                    return;
                }
                if(password.length<8){
                    this.showMyToast("密码至少8位", 1000);
                    return;
                }
                var confirmPassword = $.trim(this.$el.find(".confirm-password").val());
                if (!confirmPassword) {
                    this.showMyToast("请输入确认密码", 1000);
                    return;
                }

                if (password != confirmPassword) {
                    this.showMyToast("密码和确认密码不一致", 1000);
                    return;
                }
                var code= $.trim(self.$el.find("#inputVerifyCode").val());
                if (!code) {
                    this.showMyToast("请输入验证码", 1000);
                    return;
                }

                this.showLoading();
                var url = Lizard.host+Lizard.apiUrl+"users";
                $.ajax({
                    url: url,
                    dataType: "json",
                    type: "post",
                    data: {cell: mobile, password: password, password_confirmation: confirmPassword, type: "renter",vcode:code},
                    success: function (data) {
                        self.hideLoading();
                        if (data.error) {
                            self.showMyToast(data.error.message, 1000);
                            return
                        }
                        if (data.user) {
                            data.user.token=data.user.authentication_token;
                            self.setLoginStatus({isLogin: true, user: data.user,token:data.user.authentication_token});
                            self.showMyToast("注册成功！", 1000);
                            Lizard.goTo("login.html");
                        }

                    },
                    error: function (e) {
                        self.hideLoading();
                        self.showMyToast("网络错误", 1000);
                    }
                });

            },
            isMobile:  function (a) {
                var b = /^(1[3-8][0-9])\d{8}$/;
                return b.test(a)
            },
            ajaxException: function (msg) {
                self.loginBtn.html("登录");
                self.hideLoading();
                self.showMyToast('网络错误，请重试', 2000);
            },
            onCreate: function () {
                self = this;
                self.$el.html(TplRegister);
            },

            onShow: function () {
                var noCheck = Lizard.P("noCheck");
                self.setHeader();
                self.showLoading();

                self.hideLoading();

            },
            //设置标题
            setHeader: function (type) {
                self.header.set({
                    title: '注册',
                    back: !0,
                    backtext: '<i class="top_more left"></i> ',
                    view: this,
                    events: {
                        returnHandler: function () {
                            self.toggleSideBar();
                        },
                        commitHandler: function () {



                        }
                    }
                });
            }
        }
    );
    return View;
});