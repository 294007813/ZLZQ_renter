define(['BaseView', "cUIInputClear","cUIImageSlider" ,"Model", "Store","UIGroupSelect","UIAlert","UITab","text!TplMyRecord"], function (BaseView, cUIInputClear,cUIImageSlider, Model, Store,UIGroupSelect,cUIAlert,cUITab,tplMyRecord) {
    var self;
    var View = BaseView.extend({
        ViewName: 'myrecord',
        events: {
            "click .housing .btn":"toReserve",
            "click .location_icon" :"toLocation",
            "click .search-btn":"toSearch",
            "click .contract-list li":"toContract",
            "click .p-list li":"toExchange"
        },



        ajaxException: function (msg) {

            self.hideLoading();
            self.showMyToast('网络错误，请重试', 2000);
        },

        onCreate: function () {
            self = this;

        },
        onShow: function () {
            self.$el.html(tplMyRecord);

            var data = [{id: 0, name: "收入记录"}, {id: 1, name: "扣除记录"}];
            self.tablist =  new cUITab({
                datamodel: {data: data},
                wrapper: self.$el.find(".tab-ct"),
                onChange: function (data) {

                    if (data.id == 0) {
                        self.$el.find(".tab-1").show();
                        self.$el.find(".tab-2").hide();
                    }
                    if (data.id == 1) {
                        self.$el.find(".tab-2").show();
                        self.$el.find(".tab-1").hide();
                    }
                }

            });
            self.tablist.show();

            self.setHeader();
            self.hideLoading();

        },
        //设置标题
        setHeader: function () {
            self.header.set({
                title: '积分记录',
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
