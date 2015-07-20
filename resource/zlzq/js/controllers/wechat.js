define(['BaseView', "cUIInputClear","cUIImageSlider" ,"Model", "Store","text!TplWeChat"], function (BaseView, cUIInputClear,cUIImageSlider, Model, Store,TplWcChat) {
    var self,
        listModel=Model.ListModel.getInstance();
    var View = BaseView.extend({
        ViewName: 'wechat',
        events: {
            "click .housing .btn":"toReserve",
            "click .location_icon" :"toLocation",
            "click .search-btn":"toSearch",
            //"click .info_list li:first-child":"toComment",
            "click .house_icon":"toFavourite",
            //"click .info_btnarea":"toFavourite"
            "click .info_btnarea .btn":"toMyorder"
        },







        onCreate: function () {
            self = this;
            self.$el.html(TplWcChat);

        },
        onShow: function () {
            self.hideLoading();
            self.setHeader();





        },
        //设置标题
        setHeader: function (type) {
            self.header.set({
                title: '微信关注',
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
})
