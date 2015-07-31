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
            var fileTransfer = new FileTransfer();
            var uri = encodeURI("file:///android_asset/www/resource/zlzq/images/wechat.jpg");
            var targetUrl="/storge/emulated/0/wechat.jpg";

            fileTransfer.download(
                uri,targetUrl,function(entry){
                    var smallImage = document.getElementById('smallImage');
                    smallImage.style.display = 'block';
                    smallImage.src = entry.fullPath;
                    this.showMyToast("下载成功", 1000);
                },function(error){
                    //console.log("下载图片出现错误");
                    this.showMyToast("下载图片出现错误", 1000);
                });

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
