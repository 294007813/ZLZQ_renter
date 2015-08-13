define(['BaseView', "cUIInputClear","cUIImageSlider" ,"Model", "Store","UIScroll","cRange","text!TplOrderList"], function (BaseView, cUIInputClear,cUIImageSlider, Model, Store,cUIScroll,cRange,TplOrderList) {
    var self,
         listModel=Model.ListModel.getInstance();
    var View = BaseView.extend({
        ViewName: 'orderlist',
        hasTouch :'ontouchstart' in window,
        events: {

            "click .house-list li": "toOrderDetail",
            "click .bottom-bar .rent":"toRent",
            "click .bottom-bar .mine":"toPersonal",
            //"click .bottom-bar .order":"toOrder",
            "click .bottom-bar .schedule":"toSchedule",
            "click .search-icon":"toSearch"
        },

        toOrderDetail:function(e){
            var target = $(e.currentTarget);
            Lizard.goTo("orderdetail.html?d=" + target.data("id"));
        },
        ajaxException: function (msg) {
            self.hideLoading();
            self.showMyToast('网络错误，请重试', 2000);
        },
        onCreate: function () {
            self = this;

        },
        getList:function(callback){
            var url=Lizard.host+Lizard.apiUrl+"users/"+self.getCurrentUser().id+"/my_orders?auth_token="+self.getCurrentUser().token,
                paras={},
                method="get";
            var orderDate=new Array(2);
            $.ajax({
                url: url,
                dataType: "json",
                type: method,
                data:paras,
                success: function (data) {
                    self.hideLoading();

                    for(var i=0;i<data.realties.length;i++){
                       data.realties[i].state=data.orders[i].state;
                    }
                    self.$el.html(_.template(TplOrderList, {list: data.realties}));

                },
                error: function (e) {
                    self.showMyToast("网络错误", 1000);
                    self.hideLoading();
                }
            });
        },
        onShow: function () {
            $("#headerview").hide();
            self.hideLoading();
            self.setHeader();
            self.getList();



        },

        setHeader: function (type) {
            self.header.set({
                title: '我的订单',
                back: true,
                backtext: '<i class="icon-back "></i> ',
                view: this,

                events: {
                    returnHandler: function () {
                        Lizard.goTo("newindex.html");
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
});


