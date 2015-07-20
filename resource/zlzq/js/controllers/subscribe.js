define(['BaseView', "cUIInputClear","cUIImageSlider" ,"Model", "Store","UIGroupSelect","text!TplSubscribe"], function (BaseView, cUIInputClear,cUIImageSlider, Model, Store,UIGroupSelect,TplSubscribe) {
    var self;
    var View = BaseView.extend({
        ViewName: 'comment',
        events: {
            "click .housing .btn":"toReserve",
            "click .location_icon" :"toLocation",
            "click .search-btn":"toSearch",
            "click .visit":"selectDate",
            "click .check":"selectDate"
        },

        selectDate:function(e){
            self.dateScroller.show();
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
        onCreate: function () {
            self = this;
             self.$el.html(TplSubscribe);
        },
        onShow: function () {
            self.setHeader();

            var d1 = this.getDate(), initData = [d1, d1[0].months, d1[0].months[0].days], initIndex = [0, 0, 0];
            self.dateScroller = self.dateScroller || new UIGroupSelect({
                datamodel: {title: "看房时间", tips: ""},
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
                onOkAction: function (t) {
                    this.hide()
                },
                onCancelAction: function () {
                    this.hide()
                },
                hide: function () {
                    this.destroy()
                }
            })

       //     self.dateScroller.show();
            self.hideLoading();

        },
        //设置标题
        setHeader: function () {
            self.header.set({
                title: '预约时间',
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
                        Lizard.goTo("order.html");
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
