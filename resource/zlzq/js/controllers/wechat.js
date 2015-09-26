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
            "click .info_btnarea .btn":"toMyorder",
            "click #qrcode":"toDownload"
        },

        toDownload: function(){
            var iframe = document.createElement("iframe");
            iframe.width = "100%";
            iframe.height ="0";
            iframe.src = "./downloadwechat.html";
            iframe.frameBorder = "0";
            iframe.frameBorder = "no";
            iframe.scrolling = "no";
            iframe.border = "0";
            if (navigator.userAgent.indexOf("MSIE") > -1 && !window.opera) {
                iframe.onreadystatechange = function() {
                    if (iframe.readyState == "complete") {
                        self.afterIframeLoad();
                    }
                };
            } else {
                iframe.onload = function() {
                    self.afterIframeLoad();
                };
            }
            self.$el.append(iframe);
            self.iframeContent = iframe;
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
