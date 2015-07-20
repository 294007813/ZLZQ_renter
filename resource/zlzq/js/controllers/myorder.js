define(['BaseView', "cUIInputClear","cUIImageSlider" ,"Model", "Store","UIGroupSelect","text!TplMyorder"], function (BaseView, cUIInputClear,cUIImageSlider, Model, Store,UIGroupSelect,TplMyorder) {
    var self;
    var View = BaseView.extend({
        ViewName: 'comment',
        events: {
            "click .timeS-mask" :"selectDate",
            "click .timeE-mask" :"selectDate",
            "click .years" :"years",
            //"click .phone" :"getPhone",

        },

        selectDate:function(e){
            self.dateScroller.show();
            self.currentDateBox=$(e.currentTarget).parent().find("input");

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


        getDate:function(){
            var d1 = [];
            for (var i = 0; i < 5; i++) {
                d1.push({key: (2015 + i),name:(2015 + i),value:(2015 + i)});
                d1[d1.length-1].months = [];
                var d2 = d1[d1.length-1].months;
                for (var j = 1; j < 13; j++) {
                    d2.push({key: j,name:j,value:j});
                    d2[d2.length-1].days = [];
                    var d3 = d2[d2.length-1].days;
                    for (var k = 1; k < 32; k++) {
                        d3.push({key: k, name: k, value: k});
                    }
                }
            }
            return d1;
        },
        commitData:function(){

            var timeSdata = $.trim(this.$el.find(".timeS").val());
            if(!timeSdata){
                this.showMyToast("请选择日期", 1000);
                return;
            }
            var timeEdata = $.trim(this.$el.find(".timeE").val());
            if(!timeEdata){
                this.showMyToast("请选择日期", 1000);
                return;
            }
            if(Date.parse(timeSdata)>=Date.parse(timeEdata)){
                this.showMyToast("开始时间应小于截止时间", 1000);
                return;
            }
            var yearsdata = $.trim(this.$el.find("option").not(function(){ return !this.selected }).val());
            if(!yearsdata){
                this.showMyToast("请选择月数", 1000);
                return;
            }
            var phonedata = $.trim(this.$el.find(".phone").val());
            if(!/^(1[3-8][0-9])\d{8}$/.test(phonedata)){
                this.showMyToast("请填写正确的联系方式", 1000);
                return;
            }
            this.showLoading();
            var url = Lizard.host+Lizard.apiUrl+"orders";
            $.ajax({
                url: url,
                dataType: "json",
                type: "post",
                data: {"order[state]": "新建", "order[user_id]": self.getCurrentUser().id, "order[rent_from]": timeSdata, "order[rent_to]": timeEdata,"order[rent_months]":yearsdata,auth_token:self.getCurrentUser().token,"order[back_cell]":phonedata,"order[realty_id]":Lizard.P("realtyid")},
                success: function (data) {
                    self.showMyToast("下订单成功！", 1000);
                    Lizard.goTo("list.html");
                    self.hideLoading();
                },
                error: function (e) {
                    self.hideLoading();
                    self.showMyToast("服务器异常", 1000);
                }
            });
        },
        onCreate: function () {
            self = this;
             self.$el.html(TplMyorder);
        },
        onShow: function () {
            self.setHeader();
            self.$el.find(".phone").val(self.getCurrentUser().cell);//手机号默认值
            var d1 = this.getDate(), initData = [d1, d1[0].months, d1[0].months[0].days], initIndex = [0, 0, 0];
            self.dateScroller = self.dateScroller || new UIGroupSelect({
                datamodel: {title: "选择日期", tips: ""},
                needAnimat: !1,
                data: initData,
                indexArr: initIndex,
                displayNum: 5,
                onCreate: function () {
                    this.$el.addClass("plugin_date")
                },
                changedArr: [function (t) {
                    var e = this.scrollArr[1], i = this.scrollArr[2];
                    e.reload(t.months), i.reload(t.months[0].days), e.setIndex(0), i.setIndex(0)
                }, function (t) {
                    var e = this.scrollArr[2];
                    e.reload(t.days), e.setIndex(0)
                }],
                onOkAction: function (item) {
                   self.currentDateBox && self.currentDateBox.val(item[0].key+"-"+item[1].key+"-"+item[2].key);
                    this.hide()
                },
                onCancelAction: function () {
                    this.hide()
                },
                hide: function () {
                    this.destroy()
                }
            })

            //self.dateScroller.show();
            self.hideLoading();

        },
        //设置标题
        setHeader: function () {
            self.header.set({
                title: '我的订单',
                back: true,
                backtext: '<i class="icon-back "></i> ',
                view: this,
                btn: {
                    title: '提交',
                    id: 'confirm-btn',
                    classname: 'right_btn'
                },
                events: {
                    returnHandler: function () {
                        Lizard.goTo("list.html");
                    },
                    commitHandler: function () {
                        self.commitData();
                    }
                }
            });
        },
        onHide: function () {

        }
    });

    return View;
})
