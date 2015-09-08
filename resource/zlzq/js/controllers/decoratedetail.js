define(['BaseView', "cUIInputClear","cUIImageSlider" ,"Model", "Store","text!TplDecorateDetail"], function (BaseView, cUIInputClear,cUIImageSlider, Model, Store,TplDecorateDetail) {
    var self,
        listModel=Model.ListModel.getInstance();
    var View = BaseView.extend({
        ViewName: 'decoratedetail',
        events: {
            "click .housing .btn":"toReserve",
            "click .location_icon" :"toLocation",
            "click .search-btn":"toSearch",
            "click .info_list li:first-child":"toComment",

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

        getDetail:function(callback) {


                var url =Lizard.host+Lizard.apiUrl+"companies/" + Lizard.P("d");

            $.ajax({
                url: url,
                dataType: "json",
                contentType: "application/json",
                type: "get",
                success: function (data) {
                    callback(data);
                    //self.houseData = data;

                    self.hideLoading();
                },
                error: function (e) {

                    self.showMyToast("网络错误", 1000);
                }
            });
        },
        onCreate: function () {
            self = this;

        },
        onShow: function () {
            //self.hideLoading();
            $("#headerview").hide();
            $("#main").css("padding","0");


            //self.hideLoading();

            self.getDetail(function (data) {
                self.setHeader();
                self.$el.html(_.template(TplDecorateDetail, {decorate: data}));

                //self.hideLoading();

                self.changeP();
                self.addA();
                //self.lookA();
            });


        },

        changeP:function(){
            //根据屏幕大小切换图片
            var width=$(window).width();
            self.$(".house_slider>img").css("width",width+"px");
            var body=self.$(".bodys img");
            if(body.width()>(width-40)){
                body.width(width-40+'px');
                body.height('auto');
            }
        },

        //添加a标签
        addA:function(){
            $(".bodys img").each(function(){
                $(this).wrap("<a></a>");
                $(this).parent("a").attr("href",$(this).attr("src"));
                //alert($(this).parent("a").attr("href"));
                //alert($(this).attr("src"));
                //alert("1");
            })
        },

        //设置标题
        setHeader: function (type) {
            self.header.set({
                title: '装修案例详情',
                back: true,
                backtext: '<i class="icon-back "></i> ',
                view: this,

                events: {
                    returnHandler: function () {

                        Lizard.goTo("decoratelist.html");

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
