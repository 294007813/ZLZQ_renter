define(['BaseView', "cUIInputClear","cUIImageSlider" ,"Model", "Store","text!TplNewIndex"], function (BaseView, cUIInputClear,cUIImageSlider, Model, Store,TplNewIndex) {
    var self,pic,
        listModel=Model.ListModel.getInstance();
    var View = BaseView.extend({
        ViewName: 'newindex',
        events: {

            "click .bottom-bar .rent":"toRent",
            "click .bottom-bar .mine":"toPersonal",
            "click .bottom-bar .order":"toOrderList",
            "click  .myhouse":"myHouse",
            "click  .favourite":"toMyFavourite",
            "click  .decorate":"toDecorate",
            "click  .watch":"toWatch",
            "click  .news":"toNews",

        },


        //点击'我的收藏'
        toMyFavourite:function(){
            var isLogin = self.isLogin();
            if (!isLogin) {
                Lizard.goTo("login.html?fromPage=0");
                //self.showMyToast("请先登录", 2000);
                return;
            }
            Lizard.goTo("list.html?favorite=1");
        },

        toNews:function(){
            Lizard.goTo("newslist.html");
        },

        //点击装修
        toDecorate:function(){
            Lizard.goTo("decoratelist.html");
        },

        myHouse:function(e){
            //window.location.href="index.html";
            Lizard.goTo("index.html");
        },

        onCreate: function () {
            self = this;
            self.$el.html(TplNewIndex);
        },

        onShow: function () {
            self.hideLoading();
            self.setHeader();
            self.$el.html(TplNewIndex);
             pic = [
                //{id: 1, src: './resource/zlzq/images/newindex1.png', href: './res/img/1.jpg'},
                {id: 2, src: './resource/zlzq/images/renterindex1.jpg', href: './res/img/2.jpg'},
                {id: 3, src: './resource/zlzq/images/renterindex2.jpg', href: './res/img/3.jpg'},
                {id: 4, src: './resource/zlzq/images/renterindex3.jpg', href: './res/img/4.jpg'}
            ];

            //var  pic=[];
            //for(var i=0;i<data.realty.media.length;i++) {
            //    pic.push({id: i + 1, src: data.realty.media[i].avatar, href: './res/img/1.jpg'});
            //}


            self.houseSlider = new cUIImageSlider({
                datamodel: {
                    data: pic,
                    itemFn: function (item) {
                        return '<img data-src="' + item.src + '" src="' + item.src + '" >';
                    }
                },
                autoPlay: true,
                displayNum: 1,
                wrapper: this.$('.house_slider1')
            });
            self.houseSlider.show();


            var height=$(window).height();
            ////alert(height);
            if(height<615){
                self.$(".house_slider1").css("height","350px");
                self.$(".house_slider1 img").css("height","350px");
                self.$(".cui-navContainer").css("top","300px");
                self.$(".cm-slide").css("height","350px");
                //}else{
                //    self.$(".slide-block ").css("height","415px");
                //    self.$(".slide-block img").css("height","415px");
            }
        },

        toWatch:function(){

            Lizard.goTo("wechat.html");
        },

        //设置标题
        setHeader: function (type) {
            self.header.set({
                title: '租来租去租客版',
                back: !0,
                backtext: '<i class="top_more left"></i> ',
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
