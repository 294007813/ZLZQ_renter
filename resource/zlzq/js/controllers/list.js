define(['BaseView', "cUIInputClear","cUIImageSlider" ,"Model", "Store","UIScroll","cRange","text!TplList","text!TplHList","UIGroupSelect"], function (BaseView, cUIInputClear,cUIImageSlider, Model, Store,cUIScroll,cRange,TplList,TplHList,UIGroupSelect) {
    var self;
    var View = BaseView.extend({
        ViewName: 'list',
        url: "http://zlzq.easybird.cn",
        events: {
            "click .favourite": "toFavorite",
            "click .rent": "toRent",
            "click .house-list li": "toHouse",
            "click .location_icon": "toLocation",
            "click .l-ct ": "toIndex",
            "click .house-type>li div": "setHouseType",
            "click .filter-list li": "setFilter",
            "click .sort-list li": "setSortFilter",
            "click a.yes": "setTypeFilter",
            "click a.reset": "reSetTypeFilter",
            "click .right-column li": "setAreaFilter",
            "click .left-column li": "setDistrictFilter",
            "click .r-bar .search-box-mask": "toGetAreaList",
            "click .r-bar .btn": "toSearch",
            "click .bottom-bar .rent": "toRent",
            "click .bottom-bar .mine": "toPersonal",
            "click .bottom-bar .order": "toOrderList",
            "click .bottom-bar .schedule": "toSchedule",
            "click .search-icon": "toSearch"
        },
        cancel: function (e) {
            self.$el.find(".r-bar input").val("");
            self.$el.find(".searchBar-inner").removeClass("active");
        },
        toGetAreaList: function (e) {
            self.$el.find(".searchBar-inner").addClass("active");
            self.$el.find(".r-bar input").focus();
        },

        setSortFilter: function (e) {
            var target = $(e.currentTarget);
            self.$el.find(".sort-list li").each(function () {
                var $this = $(this);
                $this.removeClass("active");
            });
            target.addClass("active");
            var currentBox = self.$el.find(".sort-bar-box");
            currentBox.removeClass("in");
            self.$el.find(".mask").removeClass("show");

            var sid = target.data("sid"),
                paras = {};
            if (sid == 1) {
                paras = {order: "price_high"}
            }
            if (sid == 2) {
                paras = {order: "price_low"}
            }
            if (sid == 3) {
                paras = {order: "published_at"}
            }

            document.removeEventListener('touchmove', self.preventDefault, false);
            self.search(paras, function (data) {
                self.$el.find(".house-list-box").html($(_.template(TplHList, {
                    list: data.realties
                })));
                self.lazyLoadImage(data.realties);
            })
        },
        reSetTypeFilter:function(e){
            self.$el.find(".house-type>li div.selected").removeClass("selected");
            //self.range.reset();

            self.room_count="";
            self.price_low = "";
            self.price_high = "";

        },
        setTypeFilter: function (e) {

            var currentBox = self.$el.find(".type-bar-box");
            currentBox.removeClass("in");
            self.$el.find(".mask").removeClass("show");
			
            document.removeEventListener('touchmove', self.preventDefault, false);

            var type=self.$el.find(".house-type>li div.selected"),
                paras={};
             if(type){
                 paras["room_count"]=type.data("type");
             }
            self.search(paras, function (data) {
                self.$el.find(".house-list-box").html($(_.template(TplHList, {
                    list: data.realties
                })));
                self.lazyLoadImage(data.realties);
            })
        },
        setDistrictFilter: function (e) {
            var target = $(e.currentTarget);
            self.$el.find(".left-column li").each(function () {
                var $this = $(this);
                $this.removeClass("current");
            });
            target.addClass("current");

            var currentBox = self.$el.find(".area-bar-box ");
            currentBox.removeClass("in");
            self.$el.find(".mask").removeClass("show");
            document.removeEventListener('touchmove', self.preventDefault, false);

            self.search({district_id: target.data("id")}, function (data) {
                self.$el.find(".house-list-box").html($(_.template(TplHList, {
                    list: data.realties
                })));
                self.lazyLoadImage(data.realties);
            })
        },
        lazyLoadImage: function (realties) {
            _.each(realties, function (v, i) {
                (function (iid) {
                    var img = new Image();
                    img.src = v.avatar;
                    img.onload = function () {
                        var dom = document.getElementById(iid);
                        dom && (dom.src = img.src);
                    }
                })("i" + v.id)
            })
        },
        setAreaFilter: function (e) {
            self.$el.find(".right-column li").each(function () {
                var $this = $(this);
                $this.removeClass("selected");
            });
            $(e.currentTarget).addClass("selected");
            var currentBox = self.$el.find(".area-bar-box");
            currentBox.find(".area-bar").removeClass("show");
            currentBox.hide();
            self.$el.find(".mask").hide();


        },
        setHouseType: function (e) {
			var target= $(e.currentTarget);
            self.$el.find(".house-type>li div").each(function () {
                var $this = $(this);
                $this.removeClass("selected");
            });
            target.addClass("selected");
			
			if(target.data("type")=="1"){
				self.houseRentRangeScroller.show();
			}else{
			  self.houseTypeScroller.show();
			}
			
			
        },

        search: function (paras, callback) {

            paras = {};
            self.$el.find(".sort-list li").each(function () {
                var $this = $(this);
                if ($this.hasClass("active")) {
                    var sid = $this.data("sid");
                    if (sid == 1) {
                        paras["order"] = "price_high";
                    }
                    if (sid == 2) {
                        paras["order"] = "price_low";
                    }
                    if (sid == 3) {
                        //paras["order"] = "published_at";
                        paras["order"] = "";
                        delete paras.order;
                    }
                }
            });

            self.$el.find(".left-column li").each(function () {
                var $this = $(this);
                if ($this.hasClass("current")) {
                    paras["district_id"] = $this.data("id")
                    if($this.data("id")=='24'){
                        paras["district_id"] = "";
                        delete paras.district_id;
                    }
                }
            });
            //var type=self.$el.find(".house-type>li div.selected");
            //if(type.length>0) {
            //    paras["room_count"] = type.data("type");
            //}
            if(self.room_count){
                paras["room_count"] = self.room_count;
            }
            if(self.price_high){
                paras["price_high"] = self.price_high;
            }
            if(self.price_low) {
                paras["price_low"] = self.price_low > 0 ? self.price_low : 0;
            }

            self.showLoading();
            $.ajax({
                url: self.url + '/api/v1/realties/search',
                dataType: "json",
                type: "post",
                data: paras,
                success: function (data) {
                    self.hideLoading();
                    callback && callback(data);
                },
                error: function (e) {
                    self.showMyToast("网络错误", 1000);
                    self.hideLoading();
                }
            });


        },
        toIndex: function (e) {
            //window.location.href="index.html";
            Lizard.goTo("index.html");
        },


        toHouse: function (e) {
            var target = $(e.currentTarget);
            Lizard.goTo("house.html?d=" + target.data("id"));
        },

        setFilter: function (e) {
            var target = $(e.currentTarget);
            //if (self.currentFilter == target.data("key")) {
            //    return;
            //}
            self.$el.find(".filter-list li").each(function () {
                var $this = $(this);
                $this.find(".filter-icon").removeClass("selected");
            });
            target.find(".filter-icon").addClass("selected");

            var currentBox = self.$el.find("." + target.data("key") + "-bar-box");
            if (currentBox.find("." + target.data("key") + "-bar").hasClass("show")) {
                return;
            }

            if (self.lastFilter && target.data("key") != self.lastFilter) {
                var lastBox = self.$el.find("." + self.lastFilter + "-bar-box");
                lastBox.removeClass("trans");
                lastBox.removeClass("in");
            }

            currentBox.addClass("trans").toggleClass("in");
            if (currentBox.hasClass("in")) {
                self.$el.find(".mask").css("left", 0).addClass("show");
                document.addEventListener('touchmove', self.preventDefault, false);
            } else {
                self.$el.find(".mask").css("left", 0).removeClass("show");
                document.removeEventListener('touchmove', self.preventDefault, false);

            }
            self.lastFilter = target.data("key");


        },
        preventDefault: function (e) {
            e.preventDefault();
        },
        getDistricts: function (callback) {
            $.ajax({
                url: self.url + '/api/v1/districts',
                dataType: "json",
                contentType: "application/json",
                type: "get",
                success: function (data) {
                    callback && callback(data.districts);
                }
            });

        },
		 getRentRange:function(e){
            var d1 = [];
            for (var i = 0; i < 5; i++) {
                d1.push({key: (2015 + i),name:(2015 + i),value:(2015 + i)});
                d1[d1.length-1].months = [];
                var d2 = d1[d1.length-1].months;
                for (var j = 1; j < 2; j++) {
                    d2.push({key: j,name:j,value:j});
                    d2[d2.length-1].days = [];
                    var d3 = d2[d2.length-1].days;
					
					 d3.push({key: 1, name: '1000以下', value: '1000以下'});
					 d3.push({key: 2, name: '1000-2000', value: '1000-2000'});
					 d3.push({key: 3, name: '2000-3000', value: '2000-3000'});
					 d3.push({key: 4, name: '3000-4000', value: '3000-4000'});
				     d3.push({key: 5, name: '4000-5000', value: '4000-5000'});
					 d3.push({key: 6, name: '5000-6000', value: '5000-6000'});
					 d3.push({key: 7, name: '6000-7000', value: '6000-7000'});
				     d3.push({key: 8, name: '7000-8000', value: '7000-8000'});
					 d3.push({key: 9, name: '8000-9000', value: '8000-9000'});
					 d3.push({key: 10, name: '9000-10000', value: '9000-10000'});
					 d3.push({key: 11, name: '10000以上', value: '10000以上'});
						 
   
                }
            }
            return d1;
        },
		 getHouseType:function(e){
            var d1 = [];
            for (var i = 0; i < 5; i++) {
                d1.push({key: (2015 + i),name:(2015 + i),value:(2015 + i)});
                d1[d1.length-1].months = [];
                var d2 = d1[d1.length-1].months;
                for (var j = 1; j < 2; j++) {
                    d2.push({key: j,name:j,value:j});
                    d2[d2.length-1].days = [];
                    var d3 = d2[d2.length-1].days;
					 d3.push({key: 1, name: '1室', value: '1'});
					 d3.push({key: 1, name: '2室', value: '2'});
					 d3.push({key: 1, name: '3室', value: '3'});
					 d3.push({key: 1, name: '4室', value: '4'});
   
                }
            }
            return d1;
        },
        ajaxException: function (msg) {
            self.hideLoading();
            self.showMyToast('网络错误，请重试', 2000);
        },
        onCreate: function () {
            self = this;

        },
        getList: function (callback) {
            var url = self.url + "/api/v1/realties/",
                paras = {},
                method = "get";
            if (Lizard.P("favorite")) {

                url = url + "liked_realties?auth_token=" + self.getCurrentUser().token;
            }
            if (Lizard.P("addr")) {
                method = "post";
                url = url + "search";
                paras.target = decodeURIComponent(Lizard.P("addr"));
            }
            if (Lizard.P("order")) {
                url = "http://zlzq.easybird.cn/api/v1/users/" + self.getCurrentUser().id + "/my_orders?auth_token=" + self.getCurrentUser().token,
                    paras = {},
                    method = "get";

            }
            if (Lizard.P("d")) {
                method = "post";
                paras.district_id = Lizard.P("d");
                url = url + "search";
            }
            $.ajax({
                url: url,
                dataType: "json",
                type: method,
                data: paras,
                success: function (data) {
                    callback && callback(data);

                },
                error: function (e) {
                    self.showMyToast("网络错误", 1000);
                    self.hideLoading();
                }
            });
        },

        //隐藏具体地址
        addressHide:function(){
            self.$el.find(".addr").each(function(){
                var address=$.trim($(this).text());
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
                $(this).text(finadd+"***");
            })

        },

        onShow: function () {
            $("#headerview").hide();
            self.getDistricts(function (districts) {
                self.districts = districts;
                self.getList(function (data) {
                    self.hideLoading();
                    self.$el.html(_.template(TplList, {dlist: self.districts}))
                    self.$el.find(".house-list-box").html($(_.template(TplHList, {
                        list: data.realties
                    })));
                    //self.addressHide();
                    self.lazyLoadImage(data.realties); 
                    self.$el.find(".mask").addClass("m-trans");
                    self.$el.find(".mask")[0].addEventListener("webkitTransitionEnd", function () {
                        var mask = self.$el.find(".mask");
                        if (!mask.hasClass("show")) {
                            self.$el.find(".mask").css("left", 999);
                        }
                    }, false);
                    var areaBox = this.$(".area-bar");
                    areaBox.css("height", self.$el.find(".area-bar-box").height());
                    this.scrollOpts = {};
                    this.scrollOpts.wrapper = areaBox, this.scrollOpts.scroller = this.$(".left-column"), this.scroll = new cUIScroll(this.scrollOpts);

                    var d2 = self.getHouseType(), MInitData = [d2, d2[0].months, d2[0].months[0].days], MInitIndex = [0, 0, 0];
                    self.houseTypeScroller = self.houseTypeScroller || new UIGroupSelect({
                        datamodel: {title: "户型选择", tips: ""},
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
                            self.room_count = item[2].value;
                            console.log(self.room_count);
                            this.hide()
                        },
                        onCancelAction: function () {
                            this.hide()
                        },
                        hide: function () {
                            this.destroy()
                        }
                    })
                    self.houseTypeScroller.$el.addClass("month");


                    var d3 = self.getRentRange(), RInitData = [d3, d3[0].months, d3[0].months[0].days], RInitIndex = [0, 0, 0];
                    self.houseRentRangeScroller = self.houseRentRangeScroller || new UIGroupSelect({
                        datamodel: {title: "租金选择", tips: ""},
                        needAnimat: !1,
                        data: RInitData,
                        indexArr: RInitIndex,
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

                            var rentRange = item[2].value.split("-");
                            if (rentRange.length == 2) {
                                self.price_low = rentRange[0];
                                self.price_high = rentRange[1];
                            } else {
                                if (item[2].key == 1) {
                                    self.price_low = -1;
                                    self.price_high = 1000;
                                }
                                if (item[2].key == 11) {
                                    self.price_low = 10000;
                                    self.price_high = 100000;
                                }

                            }

                            this.hide()
                        },
                        onCancelAction: function () {
                            this.hide()
                        },
                        hide: function () {
                            this.destroy()
                        }
                    })
                    self.houseRentRangeScroller.$el.addClass("month");


                });
            });

        },
        setHeader: function (type) {
            self.header.set({
                title: '&nbsp;',
                back: !0,
                backtext: '<i class="top_more left"></i> ',
                view: this,
                btn: {
                    title: '<i class="top_more right"></i>',
                    id: 'confirm-btn',
                    classname: 'right_btn'
                },
                events: {
                    returnHandler: function () {

                    },
                    commitHandler: function () {

                    }
                }
            });
        },
        onHide: function () {
            $("#headerview").show();
            document.removeEventListener('touchmove', self.preventDefault, false);

        }
    });
    return View;
});


