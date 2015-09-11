/**
 * Created by Administrator on 2015/8/24.
 */
define(['BaseView', "cUIInputClear","cUIImageSlider" ,"Model", "Store","UIGroupSelect","text!TplGetreward","UIAlert"],
    function (BaseView, cUIInputClear,cUIImageSlider, Model, Store,UIGroupSelect,TplGetreward,cUIAlert) {
    var self;

    var View = BaseView.extend({
        ViewName: 'getinvitereward',
        events: {

            "click .confirm .invite-btn":"toCondirmcode"
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
        onCreate: function () {
            self = this;
            self.$el.html(TplGetreward);
        },
        onShow: function () {
            self.$el.html(TplGetreward)

            self.setrewHeader();
            self.hideLoading();

        },
        toCondirmcode:function(){

            var invite = $.trim(self.$el.find(".confirm_invite").val());

            if (!invite) {
                this.showMyToast("请输入邀请码再点击提交！", 1000);

                return;
            }

            this.showLoading();
            var url=Lizard.host+Lizard.apiUrl+"users/"+self.getCurrentUser().id+"/fullfil_invited_code?auth_token="+self.getCurrentUser().token;
            Lizard.host+Lizard.apiUrl+"users/"+self.getCurrentUser().id+"/my_orders?auth_token="+self.getCurrentUser().token,

            $.ajax({
                url: url,
                dataType: "json",
                type: "get",
                data: {invited_code:invite},
                success: function (data) {
                    self.hideLoading();
                    if (data.error) {
                        if(data.error.message=="invited_code Exist")
                            self.showMyToast("您已经输入邀请码,请勿多次输入", 1000);
                        else self.showMyToast(data.error.message, 1000);
                        return
                    }
                    else{
                        self.showMyToast("邀请码兑换成功！获得15000积分奖励！",1000)
                        self.login();

                    }


                },
                error: function (e) {
                    self.hideLoading();
                    self.showMyToast("网络错误", 1000);
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

                        //Lizard.goTo("personal.html");
                        window.location.href="personal.html";

                    }

                },
                error: function (e) {
                    self.hideLoading();
                    self.showMyToast("网络错误", 1000);
                }
            });
        },

        //设置标题
        setrewHeader: function (type) {
            self.header.set({
                title: '邀请奖励',
                back: true,
                backtext: '<i class="icon-back"></i> ',
                view: this,
                events: {
                    returnHandler: function () {
                        Lizard.goTo("user.html");
                    },
                    commitHandler: function () {

                    }
                }
            });
        }

    })



    return View;

});