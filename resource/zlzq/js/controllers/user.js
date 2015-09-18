define(['BaseView', "cUIInputClear","cUIImageSlider" ,"Model", "Store","UIGroupSelect","text!TplUser","UIAlert"], function (BaseView, cUIInputClear,cUIImageSlider, Model, Store,UIGroupSelect,tplUser,cUIAlert) {
    var self;

    var View = BaseView.extend({
        ViewName: 'user',
        events: {
            "click .housing .btn":"toReserve",
            "click .location_icon" :"toLocation",
            "click .search-btn":"toSearch",
            "click .info":"toPersonal",
            "click .check":"selectDate",
            "click .opt-list .contract":"toContract",
            "click .opt-list .score":"toMyScore",
            "click .opt-list .favorites":"toFavorite",
            "click .opt-list .order":"toOrderList",
            "click .bottom-bar .rent":"toRent",
            "click .bottom-bar .mine":"toMine",
            "click .bottom-bar .order":"toOrderList",
            "click .opt-list .invite":"togetreward",
            "click .opt-list .to_apply":"toApply",
            "click .opt-list .to_send":"toSend",
            "click .ver":"toAsk",
            "click .cd-popup":"toCancel",
            "click .cd-no":"toCancel",
            "click .cd-yes":"toUpdate",
        },
        toCancel: function(){
            self.$el.find(".cd-popup").removeClass("is-visible");
        },

        toAsk: function(){
            if(self.$el.find(".ver").hasClass("new")){
                self.$el.find(".cd-popup").addClass("is-visible");
            }else self.showMyToast("已是最新版", 1000);

        },

        toSend: function(e) {
            Lizard.goTo("sendinvitecode.html");

        },
        toUpdate:function(){
            self.showMyToast("正在下载更新程序", 1000);

        },
        checkUpdate:function(){
            var url=Lizard.host+Lizard.apiUrl+"versions/lastest?version_type=renter_android";
            $.ajax({
                url: url,
                dataType: "json",
                type: "get",
                success: function (data) {
                    if (data.error) {
                        self.showMyToast(data.error.message, 1000);
                        return
                    }
                    else{
                        self.getver=data.number;
                        self.appurl=data.url;
                    }
                },
                error: function (e) {
                    self.showMyToast("网络错误", 1000);
                }
            });
        },

        toApply: function (e) {
            this.showLoading();
            var url=Lizard.host+Lizard.apiUrl+"users/"+self.getCurrentUser().id+"/apply_deduction?auth_token="+self.getCurrentUser().token;
            $.ajax({
                url: url,
                dataType: "json",
                type: "get",
                success: function (data) {
                    self.hideLoading();
                    if (data.error) {
                        self.showMyToast(data.error.message, 1000);
                        return
                    }
                  else{
                        data.user.balance=data.user.balance
                        self.showMyToast("申请已受理，等待后台客服人员进行审核！", 1000);
                        return
                    }





                },
                error: function (e) {
                    self.hideLoading();
                    self.showMyToast("网络错误", 1000);
                }
            });

        },

        togetreward:
            function(e) {
                Lizard.goTo("getinvitereward.html");

            },
        toOrderList:function(){
            Lizard.goTo("orderlist.html");
        },

        toMyScore:function(e){
            Lizard.goTo("myScore.html");
        },
        toRent:function(e){
            Lizard.goTo("newindex.html");
        },
        toMine:function(e){
            Lizard.goTo("user.html");
        },
        toPersonal: function (e) {
            //window.location.href="personal.html";
            self.login();
        },
        selectDate:function(e){
            self.dateScroller.show();
        },
        toContract:function(e){
            Lizard.goTo("contract.html");
        },
        toReserve:function(e){
            self.$el.find(".info_ct").hide();
            self.$el.find(".housing").hide();
            self.$el.find(".reserve_ct").show();
        },
        ajaxException: function (msg) {

            self.hideLoading();
            self.showMyToast('网络错误，请重试', 2000);
        },

        onCreate: function () {
            self = this;

        },
        onShow: function () {

            $("#headerview").hide();
            self.$el.html(_.template(tplUser)({user: this.getCurrentUser(),ver:Lizard.version}));
            self.checkUpdate();
            if(self.getver!=Lizard.version){
                self.$el.find("#ver").append("<em style='color: #ff0000'>(有更新)</em>");
                self.$el.find(".ver").addClass("new");
            }
            self.hideLoading();

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
        setHeader: function () {
            self.header.set({
                title: '预约时间',
                back: true,
                backtext: '<i class="icon-back "></i> ',
                view: this,
                btn: {
                    title: '提交',
                    id: 'confirm-btn',
                    classname: 'right_btn'
                },
                events: {
                    returnHandler: function () {
                        Lizard.goTo("order.html");
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
