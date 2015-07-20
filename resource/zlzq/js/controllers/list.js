define(['BaseView', "cUIInputClear","cUIImageSlider" ,"Model", "Store","UIScroll","cRange","text!TplList","text!TplHList"], function (BaseView, cUIInputClear,cUIImageSlider, Model, Store,cUIScroll,cRange,TplList,TplHList) {
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
            document.removeEventListener('touchmove', self.preventDefault, false);

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
            self.search(paras, function (data) {
                self.$el.find(".house-list-box").html($(_.template(TplHList, {
                    list: data.realties
                })));
                self.lazyLoadImage(data.realties);
            })
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
                    img.src = v.avatar.url;
                    img.onload = function () {
                        document.getElementById(iid).src = img.src
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
            self.$el.find(".house-type>li div").each(function () {
                var $this = $(this);
                $this.removeClass("selected");
            });
            $(e.currentTarget).addClass("selected");
        },

        search: function (paras, callback) {
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
                    self.showMyToast("服务器异常", 1000);
                    self.hideLoading();
                }
            });


        },
        toIndex: function (e) {
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
            } else {
                self.$el.find(".mask").css("left", 0).removeClass("show");
            }
            self.lastFilter = target.data("key");
            document.addEventListener('touchmove', self.preventDefault, false);

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
                    self.showMyToast("服务器异常", 1000);
                    self.hideLoading();
                }
            });
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
                    self.lazyLoadImage(data.realties);
                    self.range = new cRange("rangeBar");
                    self.$el.find(".mask").addClass("m-trans");
                    self.$el.find(".mask")[0].addEventListener("webkitTransitionEnd", function () {
                        var mask = self.$el.find(".mask");
                        if (!mask.hasClass("show")) {
                            self.$el.find(".mask").css("left", 999);
                        }
                    }, false);
                    var areaBox = this.$(".area-bar");
                    areaBox.css("height", self.$el.find(".area-bar-box").height());
                    //this.scrollOpts = {};
                    //this.scrollOpts.wrapper = areaBox, this.scrollOpts.scroller = this.$(".left-column"), this.scroll = new cUIScroll(this.scrollOpts);
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


