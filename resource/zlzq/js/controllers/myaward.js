define(['BaseView', "cUIInputClear","cUIImageSlider" ,"Model", "Store","UIGroupSelect","UIAlert","text!TplMyAward"], function (BaseView, cUIInputClear,cUIImageSlider, Model, Store,UIGroupSelect,cUIAlert,tplMyAward) {
    var self;
    var View = BaseView.extend({
        ViewName: 'myaward',
        events: {
            "click .housing .btn":"toReserve",
            "click .location_icon" :"toLocation",
            "click .search-btn":"toSearch",
            "click .contract-list li":"toContract",
            "click .p-list li":"toExchange"
        },
        toExchange: function (e) {

            if( self.$el.find(".product-detail").hasClass("transformRightSideOut")){
                self.$el.find(".award-box").addClass("transformOut");
                self.$el.find(".product-detail").removeClass("transformRightSideOut");
            }else {
                self.$el.find(".product-detail").show();
                self.$el.find(".award-box").addClass("transition").addClass("transformOut");
                self.$el.find(".product-detail").addClass("transformRightSideIn");
            }

            self.setDeleteHeader();

            // self.$el.find(".contract-box").show();
        },
        setDeleteHeader:function(){
            self.header.set({
                title: '商品详情',
                back: true,
                backtext: '<i class="icon-back "></i> ',
                view: this,

                events: {
                    returnHandler: function () {
                        self.setHeader();
                        self.$el.find(".product-detail").addClass("transformRightSideOut");
                        self.$el.find(".award-box").removeClass("transformOut");

                    },
                    commitHandler: function () {
                    }
                }
            });
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

            self.hideLoading();
            self.showMyToast('网络错误，请重试', 2000);
        },

        onCreate: function () {
            self = this;

        },
        onShow: function () {

            self.$el.html(tplMyAward);

            self.setHeader();
            self.hideLoading();

        },
        //设置标题
        setHeader: function () {
            self.header.set({
                title: '我的兑换',
                back: true,
                backtext: '<i class="icon-back "></i> ',
                view: this,
                events: {
                    returnHandler: function () {
                        Lizard.goTo("myScore.html");
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
