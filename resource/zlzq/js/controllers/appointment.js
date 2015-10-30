define(['BaseView', "cUIInputClear","cUIImageSlider" ,"Model", "Store","UIGroupSelect","text!TplAppointment"], function (BaseView, cUIInputClear,cUIImageSlider, Model, Store,UIGroupSelect,TplAppointment) {
    var self;
    var View = BaseView.extend({
        ViewName: 'comment',
        events: {
            "click .back" :"backHouse",
            "click .monthC-mask" :"selectMonth",
            "click .lookT-mask" :"selectDate",

        },

        backHouse:function(){
            window.location.href="house.html?d="+Lizard.P("realtyid");
        },

        selectDate:function(e){
            self.dateScroller.show();
            self.currentDateBox=$(e.currentTarget).parent().find("input");

        },

        selectMonth:function(e){
            self.monthScroller.show();
        },

        getLooktime:function(){
            var today=new Date();
            var thatday=today;
            var days=[],times=["全天","上午","下午","晚上"];
            for(i=0;i<6;i++){
                thatday.setDate(today.getDate()+1);

                var week;
                if(thatday.getDay()==0)          week="日"
                if(thatday.getDay()==1)          week="一"
                if(thatday.getDay()==2)          week="二"
                if(thatday.getDay()==3)          week="三"
                if(thatday.getDay()==4)          week="四"
                if(thatday.getDay()==5)          week="五"
                if(thatday.getDay()==6)          week="六"
                days.push(thatday.getMonth()+1+"月"+thatday.getDate()+"日"+" "+"周"+week);
                //alert("[1]:"+thatday.toLocaleDateString()+" [2]:"+days[i]);
            }
            var d1 = [];
            for (var i = 0; i < 5; i++) {
                d1.push({key: (2015 + i),name:(2015 + i),value:(2015 + i)});
                d1[d1.length-1].months = [];
                var d2 = d1[d1.length-1].months;
                for (var j = 0; j < 6; j++) {
                    d2.push({key: days[j],name:days[j],value:days[j]});
                    d2[d2.length-1].days = [];
                    var d3 = d2[d2.length-1].days;
                    for (var k = 0; k < 3; k++) {
                        d3.push({key: times[k], name: times[k], value: times[k]});
                    }
                }
            }
            return d1;
        },

        getSex:function() {
            var d1 = [],sex=["先生","女士"];
            for (var i = 0; i < 5; i++) {
                d1.push({key: (2015 + i), name: (2015 + i), value: (2015 + i)});
                d1[d1.length - 1].months = [];
                var d2 = d1[d1.length - 1].months;
                for (var j = 1; j < 13; j++) {
                    d2.push({key: j, name: j, value: j});
                    d2[d2.length - 1].days = [];
                    var d3 = d2[d2.length - 1].days;
                    for (var k = 0; k < 2; k++) {
                        var t = sex[k];
                        d3.push({key: t, name: t, value: t});
                    }
                }
            }
            return d1;
        },

        onCreate: function () {
            self = this;
            self.$el.html(TplAppointment);
        },

        onShow: function () {
            //self.getLooktime();
            var d1 = this.getLooktime(), initData = [d1, d1[0].months, d1[0].months[0].days], initIndex = [0, 0, 0];
            var d2 = this.getSex(), MInitData = [d2, d2[0].months, d2[0].months[0].days], MInitIndex = [0, 0, 0];

            self.dateScroller = self.dateScroller || new UIGroupSelect({
                    datamodel: {title: "选择约看时段", tips: ""},
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
                        //self.currentDateBox && self.currentDateBox.val(item[0].key+"-"+item[1].key+"-"+item[2].key);
                        self.currentDateBox && self.currentDateBox.val(item[1].key+" "+item[2].key);
                        this.hide()
                    },
                    onCancelAction: function () {
                        this.hide()
                    },
                    hide: function () {
                        this.destroy()
                    }
                });
            //self.dateScroller.$el.addClass("month");

            self.monthScroller = self.monthScroller || new UIGroupSelect({
                    datamodel: {title: "选择性别", tips: ""},
                    needAnimat: !1,
                    data: MInitData,
                    indexArr: MInitIndex,
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
                        self.$el.find(".monthC").val(item[2].key);
                        //self.currentDateBox && self.currentDateBox.val(item[0].key+"-"+item[1].key+"-"+item[2].key);
                        this.hide()
                    },
                    onCancelAction: function () {
                        this.hide()
                    },
                    hide: function () {
                        this.destroy()
                    }
            })
            self.monthScroller.$el.addClass("month");

            self.hideLoading();
        }


    });
    return View;
})