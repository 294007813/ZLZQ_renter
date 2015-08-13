define(['BaseView', "cUIInputClear", "Model", "Store", "text!TplLogin"], function (BaseView, cUIInputClear, Model, Store, TplLogin) {
    var self;
    var time1=0;
    var View = BaseView.extend({
            ViewName: 'source',
            events: {
                "click  #submit": "toSignIn",
                "click .btn_get_password": "toResetPsw",
                "click .favourite":"toFavorite",
                "click #register": "toReg",
                "click .mine" :"toUserCenter",
                "click .bottom-bar .rent":"toRent",
                "click .bottom-bar .mine":"toPersonal",
                "click .bottom-bar .order":"toOrderList",
                //"click .bottom-bar .schedule":"toSchedule",
                "click #getPwd": "toGetPwd",
                "click .get-pwd-box .g_btn_s":"getPwd"
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

            getPwd:function(e) {
                var mobile = $.trim(self.$el.find(".get-pwd-box .mobile").val());
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
                this.showLoading();
                var url = Lizard.host+Lizard.apiUrl+"users/reset_password";
                $.ajax({
                    url: url,
                    dataType: "json",
                    type: "post",
                    data: {cell: mobile},
                    success: function (data) {
                        time1=new Date().getTime();
                        self.showMyToast("新密码已经以短信的形式发送你手机！", 3000);
                        //Lizard.goTo("login.html");
                        //self.setGetPwdHeader();
                        self.onCreate();
                        self.setHeader();
                        self.hideLoading();
                    },
                    error: function (e) {
                        self.hideLoading();
                        self.showMyToast("网络错误", 1000);
                    }
                });
            },
            toGetPwd:function(e) {
                self.$el.find(".login").addClass("get-pwd");
                self.setGetPwdHeader();
            },
            setGetPwdHeader:function(){
                self.header.set({
                    title: '忘记密码',
                    back: !0,
                    backtext: '<i class="icon-back "></i>  ',
                    view: this,
                    events: {
                        returnHandler: function () {
                            self.$el.find(".login").removeClass("get-pwd");
                            self.setHeader();
                        },
                        commitHandler: function () {

                        }
                    }
                });
            },

            toReg: function (e) {
                Lizard.goTo("register.html");
            },
            toSignIn: function () {
                var mobile = $.trim(this.$el.find("#username").val());
                if (!mobile) {
                    this.showMyToast("请输入手机号", 1000);
                    return;
                }
                if( !/^(1[3-8][0-9])\d{8}$/.test(mobile)){
                    this.showMyToast("请输入正确的手机号", 1000);
                    return;
                }
                var password = $.trim(this.$el.find("#password").val());
                if (!password) {
                    this.showMyToast("请输入密码", 1000);
                    return;
                }
                this.showLoading();
                var url = Lizard.host+Lizard.apiUrl+"users/login";
                $.ajax({
                    url: url,
                    dataType: "json",
                    type: "post",
                    data: {cell: mobile, password: password,type: "renter"},
                    success: function (data) {
                        self.hideLoading();
                        if (data.error) {
                            self.showMyToast("用户名或密码错误！", 1000);
                            return
                        }
                        if (data.user) {
                            data.user.token=data.token;
                            data.user.nick_name=data.nick_name;
                            data.user.avatar=data.avatar;
                            data.user.pwd=self.$el.find("#password").val();
                            self.setLoginStatus({isLogin: true,user: data.user,token:data.token});

                            //Lizard.goTo("index.html");
                            self.returnPage();

                        }

                    },
                    error: function (e) {
                        self.hideLoading();
                        self.showMyToast("网络错误", 1000);
                    }
                });
            },
            ajaxException: function (msg) {
                self.loginBtn.html("登录");
                self.hideLoading();
                self.showMyToast('网络错误，请重试', 2000);
            },
            onCreate: function () {
                self = this;
                self.$el.html(TplLogin);
            },

            onShow: function () {
                var noCheck = Lizard.P("noCheck");
                self.setHeader();
                self.showLoading();

                self.hideLoading();
                this.$el.find("#password").val("");
                //this.$el.find("#username").value("");
            },

            //返回原页
            returnPage: function (){
                if(Lizard.P("fromPage")==0) Lizard.goTo("newindex.html");
                if(Lizard.P("fromPage")==1) Lizard.goTo("list.html");

                Lizard.goTo("newindex.html");
            },

            //设置标题
            setHeader: function (type) {
                self.header.set({
                    title: '登录',
                    back: true,
                    backtext: '<i class="icon-back"></i> ',
                    view: this,
                    events: {
                        returnHandler: function () {
                            self.returnPage();
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