define(['BaseView', "cUIInputClear","cUIImageSlider" ,"Model", "Store","UIGroupSelect","text!TplSchedule"], function (BaseView, cUIInputClear,cUIImageSlider, Model, Store,UIGroupSelect,TplSchedule) {
    var self;
    var View = BaseView.extend({
        ViewName: 'schedule',
        events: {
            "click .housing .btn":"toReserve",
            "click .location_icon" :"toLocation",
            "click .search-btn":"toSearch",
            "click .visit":"selectDate",
            "click .check":"selectDate",
            "click .bottom-bar .rent":"toRent",
            "click .bottom-bar .mine":"toPersonal",
            "click .bottom-bar .order":"toOrder",
            //"click .bottom-bar .schedule":"toSchedule"
        },

        selectDate:function(e){
            self.dateScroller.show();
        },
        toReserve:function(e){
            self.$el.find(".info_ct").hide();
            self.$el.find(".housing").hide();
            self.$el.find(".reserve_ct").show();
        },
        ajaxException: function (msg) {
            self.loginBtn.html("登录");
            self.hideLoading();
            self.showMyToast('网络错误，请重试', 2000);
        },

        onCreate: function () {
            self = this;
            self.$el.html(TplSchedule);
        },
        onShow: function () {
            self.setHeader();

            self.hideLoading();

        },
        //设置标题
        setHeader: function () {
            self.header.set({
                title: '看房日程',
                back: true,
                backtext: '&nbsp; ',
                view: this,
                events: {
                    returnHandler: function () {

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
