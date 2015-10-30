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
                window.location.href="appointment.html?realtyid="+Lizard.P("d");
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

        },

        //device:function(data){
        //    var device=self.$el.find("#device");
        //    if(data.realty.house_device.house_device.bed)
        //        device.after("<span>"+"床"+"</span>"+"&nbsp;");
        //    if(data.realty.house_device.house_device.tv)
        //        device.after("<span>"+"电视"+"</span>"+"&nbsp;");
        //    if(data.realty.house_device.house_device.air_condition)
        //        device.after("<span>"+"空调"+"</span>"+"&nbsp;");
        //    if(data.realty.house_device.house_device.washer)
        //        device.after("<span>"+"洗衣机"+"</span>"+"&nbsp;");
        //    if(data.realty.house_device.house_device.refrigerator)
        //        device.after("<span>"+"冰箱"+"</span>"+"&nbsp;");
        //    if(data.realty.house_device.house_device.water_heater)
        //        device.after("<span>"+"热水器"+"</span>"+"&nbsp;");
        //    if(data.realty.house_device.house_device.chest)
        //        device.after("<span>"+"衣柜"+"</span>"+"&nbsp;");
        //    if(data.realty.house_device.house_device.hearth)
        //        device.after("<span>"+"燃气灶"+"</span>"+"&nbsp;");
        //    if(data.realty.house_device.house_device.multiple)
        //        device.after("<span>"+"复式"+"</span>"+"&nbsp;");
        //    if(data.realty.house_device.house_device.villa)
        //        device.after("<span>"+"别墅"+"</span>"+"&nbsp;");
        //    if(data.realty.house_device.house_device.garden)
        //        device.after("<span>"+"庭院"+"</span>"+"&nbsp;");
        //    if(data.realty.house_device.house_device.good_traffic)
        //        device.after("<span>"+"交通方便"+"</span>"+"&nbsp;");
        //    if(data.realty.house_device.house_device.standalone)
        //        device.after("<span>"+"唯一住房"+"</span>"+"&nbsp;");
        //    if(data.realty.house_device.house_device.subway)
        //        device.after("<span>"+"地铁"+"</span>"+"&nbsp;");
        //    if(data.realty.house_device.house_device.lift)
        //        device.after("<span>"+"电梯"+"</span>"+"&nbsp;");
        //    if(data.realty.house_device.house_device.fan)
        //        device.after("<span>"+"风扇"+"</span>"+"&nbsp;");
        //    if(data.realty.house_device.house_device.pc)
        //        device.after("<span>"+"电脑"+"</span>"+"&nbsp;");
        //    if(data.realty.house_device.house_device.chair)
        //        device.after("<span>"+"椅子"+"</span>"+"&nbsp;");
        //    if(data.realty.house_device.house_device.teapoy)
        //        device.after("<span>"+"茶几"+"</span>"+"&nbsp;");
        //    if(data.realty.house_device.house_device.sofa)
        //        device.after("<span>"+"沙发"+"</span>"+"&nbsp;");
        //    if(data.realty.house_device.house_device.table)
        //        device.after("<span>"+"桌子"+"</span>"+"&nbsp;");
        //    if(data.realty.house_device.house_device.tv_stand)
        //        device.after("<span>"+"电视柜"+"</span>"+"&nbsp;");
        //    if(data.realty.house_device.house_device.bookcase)
        //        device.after("<span>"+"书柜"+"</span>"+"&nbsp;");
        //
        //},

        //sortdevice:function(){
        //    self.$el.find(".devices>span").addClass("device");
        //    var device=$(".device");
        //    var i= 0,j=1;
        //    $.each(device,function(i,j){
        //        //alert("i="+i);
        //        if(i>=6){
        //            if(i%6==0){
        //                $(".devices").after("<li class='"+j+"'></li>");
        //                j++;
        //            }
        //            //$("."+j-1).append(this.html());
        //            //alert("j="+j);
        //        }//else this.show();
        //        i++;
        //    });
        //},

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
                        //window.location.href="list.html"

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
