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
            "click .opt-list .to_send":"toSend"

            //"click .bottom-bar .schedule":"toSchedule"
        },
        //toMyFavorites:function(e){
        //    Lizard.goTo("list.html?favorite=1");
        //},
        //toOrder:function(e){
        //    Lizard.goTo("order.html");
        //},
        toSend: function(e) {
            Lizard.goTo("sendinvitecode.html");

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
            window.location.href="personal.html";
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
            self.$el.html(_.template(tplUser)({user: this.getCurrentUser()}));

            self.hideLoading();

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
