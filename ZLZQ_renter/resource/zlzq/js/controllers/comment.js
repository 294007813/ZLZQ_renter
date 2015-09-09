define(['BaseView', "cUIInputClear","cUIImageSlider" ,"Model", "Store","text!TplComment"], function (BaseView, cUIInputClear,cUIImageSlider, Model, Store,TplComment) {
    var self;
    var View = BaseView.extend({
        ViewName: 'comment',
        events: {
            "click .housing .btn":"toReserve",
            "click .location_icon" :"toLocation",
            "click .search-btn":"toSearch"
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

        getDetail:function(callback){
            var url=Lizard.host+Lizard.apiUrl+"realties/"+Lizard.P("d");
            $.ajax({
                url: url,
                dataType: "json",
                contentType: "application/json",
                type: "get",
                success: function (data) {
                    callback(data);

                },
                error: function (e) {

                    self.showMyToast("网络错误", 1000);
                }
            });
        },
        onCreate: function () {
            self = this;
            // self.$el.html(TplHouse);

        },
        onShow: function () {
            self.setHeader();

            self.$el.html(TplComment);
            self.hideLoading();


        },
        //设置标题
        setHeader: function () {
            self.header.set({
                title: '租客评价',
                back: true,
                backtext: '<i class="icon-back "></i> ',
                view: this,
                btn: {
                    title: '<i class="top_more edit"></i>',
                    id: 'confirm-btn',
                    classname: 'right_btn'
                },
                events: {
                    returnHandler: function () {
                        Lizard.goTo("house.html");
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
