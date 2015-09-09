define(['BaseView', "cUIInputClear","cUIImageSlider" ,"Model", "Store","text!TplReservation"], function (BaseView, cUIInputClear,cUIImageSlider, Model, Store,TplReservation) {
    var self;
    var View = BaseView.extend({
        ViewName: 'index',
        events: {
        },
        showMyToast: function (msg, time) {
            self.showToast({
                datamodel: {
                    content: msg
                },
                maskToHide: false,
                hideSec: time
            });
        },
        ajaxException: function (msg) {
            self.loginBtn.html("登录");
            self.hideLoading();
            self.showMyToast('网络错误，请重试', 2000);
        },
        onCreate: function () {
            self = this;
            self.$el.html(TplReservation);

        },
        onShow: function () {
            self.setHeader();
            if (this.houseSlider) return;
            var data = [
                { id: 1, src: './resource/lzk/images/house1.png', href: './res/img/1.jpg' },
                { id: 2, src: './resource/lzk/images/house1.png', href: './res/img/2.jpg' },
                { id: 3, src: './resource/lzk/images/house1.png', href: './res/img/3.jpg' },
                { id: 4, src: './resource/lzk/images/house1.png', href: './res/img/4.jpg' }
            ];
            this.houseSlider = new cUIImageSlider({
                datamodel: {
                    data: data,
                    itemFn: function (item) {
                        return '<img data-src="' + item.src + '" src="' + item.src + '" >';
                    }
                },
                displayNum: 1,
                wrapper: this.$('.house_slider')
            });
            this.houseSlider.show();
            self.hideLoading();
        },

        //设置标题
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
                        if (self.$('.js_user_center').hasClass('hide')) {
                            self.$('.bg_mask').show();
                            self.$('.js_user_center').removeClass('hide');
                        } else {
                            self.$('.bg_mask').hide();
                            self.$('.js_user_center').addClass('hide');
                        }
                    },
                    commitHandler: function () {

                        if (self.$('.js_user_center').hasClass('hide')) {
                            self.$('.bg_mask').show();
                            self.$('.js_user_center').removeClass('hide');
                        } else {
                            self.$('.bg_mask').hide();
                            self.$('.js_user_center').addClass('hide');
                        }

                    }
                }
            });
        },
        onHide: function () {

        }
    });

    return View;
})
