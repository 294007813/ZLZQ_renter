define(['BaseView', "cUIInputClear","cUIImageSlider" ,"Model", "Store","text!TplHouse","cImageZoom"], function (BaseView, cUIInputClear,cUIImageSlider, Model, Store,TplHouse,cImageZoom) {
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
            "click .info_btnarea .btn":"toMyorder",
            "click #map":"toHouseMap"
        },

        toHouseMap:function(){
            if(self.datas.longitude){
                window.location.href="houseplace.html?realtyid="+Lizard.P("d")+"&longitude="+self.datas.longitude+"&latitude="+self.datas.latitude;
                }else self.showMyToast("找不到此地址", 1000);
        },

        //我要约看
        toMyorder:function(){
            if(self.isLogin()){
                //Lizard.goTo("myorder.html?realtyid="+Lizard.P("d"));
                if(self.flag){
                    window.location.href="appointment.html?realtyid="+Lizard.P("d");
                }else{
                    self.showMyToast("此房源已下过订单,请勿重复下单", 1000);
                }

            }else {
                Lizard.goTo("login.html");
                return;
            }
        },

        getVisitlist:function(){
            if(self.isLogin()){
                var url=Lizard.host+Lizard.apiUrl+"review_forms?auth_token="+self.getCurrentUser().token;
                $.ajax({
                    url: url,
                    dataType: "json",
                    type: "get",
                    success: function (data) {
                        if (data.error) {
                            self.showMyToast(data.error.message, 1000);
                            return
                        }
                        else {
                            for(i=0;i<data.length;i++){
                                if(data[i].realty_id==Lizard.P("d")){
                                    self.flag=0;
                                }
                            }

                        }
                    },
                    error: function (e) {
                        self.showMyToast(e.error, 1000);

                    }
                })
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

            //测试代码
            //callback({"realty":{"id":570,"title":"李子园","description":"","address":"李子园花园188号101","floor":1,"price":3300,"area":80,"state":"上线","published_at":"2015-12-28","checkin_at":null,"room":2,"hall":1,"wash":1,"total_height":5,"updated_at":"2015-12-28T13:48:17.000+08:00","latitude":"31.2774811616","longitude":"121.390672377","quarter_title":null,"district_id":13,"decoration_type":"简装","direction":"南","decoration_years":null,"end_at":null,"avatar":{"url":null},"house_device":{"house_device":{"realty_id":570,"id":500,"bed":null,"tv":null,"air_condition":null,"washer":null,"refrigerator":null,"water_heater":null,"chest":null,"hearth":null,"created_at":"2015-12-28T13:48:17.000+08:00","updated_at":"2015-12-28T13:48:17.000+08:00","multiple":null,"villa":null,"garden":null,"good_traffic":null,"standalone":null,"subway":null,"lift":null,"fan":null,"pc":null,"chair":null,"teapoy":null,"sofa":null,"table":null,"tv_stand":null,"bookcase":null}},"owner":{"owner_id":13,"nick_name":"代代","cell":"18321756978","avatar":null},"media":[{"medium_id":1088,"title":"","avatar":"http://7xiap4.com1.z0.glb.clouddn.com/uploads%2Fmedium%2Favatar%2F1088%2FCgEHQFZ-cs69xiP_AAEgAhPMP-U725_600-0_8-0.jpg"},{"medium_id":1089,"title":"","avatar":"http://7xiap4.com1.z0.glb.clouddn.com/uploads%2Fmedium%2Favatar%2F1089%2FCgEHXFZ-ct_yTNQPAAC5-7JYZnE782_600-0_8-0.jpg"}],"comments":[]}})

        },

        //隐藏具体地址
        addressHide:function(){
            var address=$.trim(self.$el.find(".addr").text());
            var finadd=address;
            var tes=/\d/
            //alert(address);
            if(address.charAt(address.length-1)=="室"){
                for(i=2;i<(address.length);i++){
                    if(!tes.test(address.charAt(address.length-i))){
                        finadd=address.substr(0,address.length-i+1);
                        break;
                    }
                }
            }
            self.$el.find(".addr").text(finadd+"***");

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


                self.datas=data.realty;


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
                $('.house_slider img').fancyzoom();

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
                //self.device(data);
                //self.sortdevice();
                self.addressHide();
            });
            self.flag=1;
            self.getVisitlist();

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
                        //alert(Lizard.P("favorite"));
                        //alert("["+"list.html"+(Lizard.P("favorite")?"?favorite=1":"")+"]");
                        Lizard.goTo("list.html"+(Lizard.P("favorite")?"?favorite=1":""));


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
