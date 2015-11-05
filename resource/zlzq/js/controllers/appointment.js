define(['BaseView', "cUIInputClear","cUIImageSlider" ,"Model", "Store","UIGroupSelect","text!TplAppointment"], function (BaseView, cUIInputClear,cUIImageSlider, Model, Store,UIGroupSelect,TplAppointment) {
    var self;
    var View = BaseView.extend({
        ViewName: 'appointment',
        events: {
            "click .back" :"backHouse",
            "click .lookT-mask" :"selectDate",
            "click .male" :"chMale",
            "click .female" :"chFemale",
            "click .next" :"toPut",
            "click .watchlist" :"toVisitlist",

        },

        toVisitlist:function(){
            Lizard.goTo("visitlist.html");
        },

        backHouse:function(){
            window.location.href="house.html?d="+Lizard.P("realtyid");
        },

        selectDate:function(e){
            self.dateScroller.show();
            self.currentDateBox=$(e.currentTarget).parent().find("input");

        },

        toPut:function(){
            var name = (this.$el.find(".monthC").val());
            if (!name) {
                this.showMyToast("请输入联系人称呼", 1000);
                return;
            }
            var looktime = (this.$el.find(".lookT").val());
            if (!looktime) {
                this.showMyToast("请选择约看时间", 1000);
                return;
            }

            var url=Lizard.host+Lizard.apiUrl+"review_forms?auth_token="+self.getCurrentUser().token;
            $.ajax({
                    url: url,
                    dataType: "json",
                    type: "post",
                    data:{
                        "review_form[realty_id]":Lizard.P("realtyid"),
                        "review_form[user_id]":self.getCurrentUser().id,
                        "review_form[gender]":name+self.sex,
                        "review_form[review_at]":looktime,

                    },
                success: function (data) {
                    if (data.error) {
                        self.showMyToast(data.error.message, 1000);
                        return
                    }
                    else {
                        self.succeed(data);

                    }
                },
                error: function (e) {
                    self.showMyToast(e.error, 1000);

                }
            })
        },

        succeed:function(data){
            self.$el.html(_.template(TplAppointment)({data:data.review_form}));
            self.$el.find(".subscribe-bar").hide();
            self.$el.find(".next").hide();
            self.$el.find(".succeed-appoint").show();
            if(data.review_form.realty_type=="出租房"){
                self.onwertype="房东";
            }else{
                self.onwertype="看房顾问";
            }
            self.$el.find(".ownertype").text(self.onwertype);
        },

        chMale:function(){
            self.sex="先生"
            self.$el.find(".female img").attr("src","resource/zlzq/img/unselect.png");
            self.$el.find(".female span").css("color","#737478");
            self.$el.find(".male img").attr("src","resource/zlzq/img/selected.png");
            self.$el.find(".male span").css("color","#ff6c10");
        },

        chFemale:function(){
            self.sex="女士"
            self.$el.find(".male img").attr("src","resource/zlzq/img/unselect.png");
            self.$el.find(".male span").css("color","#737478");
            self.$el.find(".female img").attr("src","resource/zlzq/img/selected.png");
            self.$el.find(".female span").css("color","#ff6c10");
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
                    for (var k = 0; k < 4; k++) {
                        d3.push({key: times[k], name: times[k], value: times[k]});
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
            self.chMale();
            var d1 = this.getLooktime(), initData = [d1, d1[0].months, d1[0].months[0].days], initIndex = [0, 0, 0];

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
            self.dateScroller.$el.addClass("looktime");


            self.hideLoading();
        }


    });
    return View;
})