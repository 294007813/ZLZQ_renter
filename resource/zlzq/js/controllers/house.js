define(['BaseView', "cUIInputClear","cUIImageSlider" ,"Model", "Store","text!TplHouse"], function (BaseView, cUIInputClear,cUIImageSlider, Model, Store,TplHouse) {
    var self,
        listModel=Model.ListModel.getInstance();
    var View = BaseView.extend({
        ViewName: 'house',
        events: {
            "click .housing .btn":"toReserve",
            "click .location_icon" :"toLocation",
            "click .search-btn":"toSearch",
            //"click .info_list li:first-child":"toComment",
            "click .house_icon":"toFavourite",
            //"click .info_btnarea":"toFavourite"
            "click .info_btnarea .btn":"toMyorder"
        },
        //我的订单
        toMyorder:function(){
            if(self.isLogin()){
                Lizard.goTo("myorder.html?realtyid="+Lizard.P("d"));
            }else {
                Lizard.goTo("login.html");
                return;
            }
        },

        //点收藏跳到’登入‘
        toFavourite:function(e){
            var isLogin = self.isLogin();
            if (!isLogin) {
                Lizard.goTo("login.html?fromPage=1");
                //self.showMyToast("请先登录", 2000);
                return;
            }

            self.showLoading();
            var url = Lizard.host+Lizard.apiUrl+"realties/" + Lizard.P("d") + "/like";
            $.ajax({
                url: url,
                dataType: "json",
                data: {
                    star: 5,
                    auth_token: self.getCurrentUser().authentication_token

                },
                type: "post",
                success: function (data) {
                    if(data.fav.fav){

                        self.$el.find(".house_collect").hide();
                        self.$el.find(".house_collect.on").show();
                        //headerTitle = '<i class="top_more favourite"></i>';
                    }else{

                        self.$el.find(".house_collect").show();
                        self.$el.find(".house_collect.on").hide();
                    }
                        //headerTitle = '<i class="top_more unfavourite"></i>';
                    self.setHeader();
                    self.hideLoading();

                },
                error: function (e) {
                    self.hideLoading();
                    self.showMyToast("网络错误", 1000);
                }
            });
        },
        //toComment:function(e){
        //    Lizard.goTo("comment.html");
        //},
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

        getDetail:function(callback) {

            if(!self.isLogin()){
                var url = Lizard.host+Lizard.apiUrl+"realties/" + Lizard.P("d");
            }else var url = Lizard.host+Lizard.apiUrl+"realties/" + Lizard.P("d")+"?auth_token="+self.getCurrentUser().authentication_token;
            $.ajax({
                url: url,
                dataType: "json",
                contentType: "application/json",
                type: "get",
                success: function (data) {
                    callback(data);
                    self.houseData = data;
                },
                error: function (e) {

                    self.showMyToast("网络错误", 1000);
                    Lizard.goTo("list.html");
                }
            });
        },
        onCreate: function () {
            self = this;
           // self.$el.html(TplHouse);

        },
        onShow: function () {

            $("#headerview").hide();
            $("#main").css("padding","0");
            //self.$el.html(TplHouse);
            self.hideLoading();


            self.getDetail(function (data) {



                self.setHeader();
                self.hideLoading();
                self.$el.html(_.template(TplHouse, {realty: data.realty}));

                //var data = [
                //    {id: 1, src: './resource/lzk/images/house1.png', href: './res/img/1.jpg'},
                //    {id: 2, src: './resource/lzk/images/house1.png', href: './res/img/2.jpg'},
                //    {id: 3, src: './resource/lzk/images/house1.png', href: './res/img/3.jpg'},
                //    {id: 4, src: './resource/lzk/images/house1.png', href: './res/img/4.jpg'}
                //];

                var  pic=[];
                for(var i=0;i<data.realty.media.length;i++) {
                    pic.push({id: i + 1, src: data.realty.media[i].avatar, href: './res/img/1.jpg'});
                }


                self.houseSlider = new cUIImageSlider({
                    datamodel: {
                        data: pic,
                        itemFn: function (item) {
                            return '<img data-src="' + item.src + '" src="' + item.src + '" >';
                        }
                    },
                    displayNum: 1,
                    wrapper: this.$('.house_slider')
                });
                self.houseSlider.show();

                if(!self.isLogin()){

                    self.$el.find(".house_collect").show();
                    self.$el.find(".house_collect.on").hide();
                }else {
                    if (data.realty.evaluation!=null) {
                        self.$el.find(".house_collect").hide();
                        self.$el.find(".house_collect.on").show();

                    } else {

                        self.$el.find(".house_collect").show();
                        self.$el.find(".house_collect.on").hide();
                    }
                }

            });

        },
        //设置标题
        setHeader: function (type) {
            self.header.set({
                title: '详细内容',
                back: true,
                backtext: '<i class="icon-back "></i> ',
                view: this,

                events: {
                    returnHandler: function () {
                        if (self.$('.js_user_center').hasClass('hide')) {
                            self.$('.bg_mask').show();
                            self.$('.js_user_center').removeClass('hide');
                        } else {
                            self.$('.bg_mask').hide();
                            self.$('.js_user_center').addClass('hide');
                        }
                        Lizard.goTo("list.html");

                    },
                    commitHandler: function () {
                        self.$('.searchBar').toggleClass('active');
                    }
                }
            });
        },
        onHide: function () {
            $("#headerview").show();
            $("#main").css("padding-top","44px");
        }
    });

    return View;
})
