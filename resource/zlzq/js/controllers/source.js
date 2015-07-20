define(['BaseView', "cUIInputClear", "Model", "Store", "text!TplSource"], function (BaseView, cUIInputClear, Model, Store, TplSource) {
    var self;
    var View = BaseView.extend({
            ViewName: 'source',
            events: {
                "click  .btn_link1": "toSignIn",
                "click .btn_reg": "toReg",
                "click .btn_get_password": "toResetPsw",
                "input .user_name_box": "toValidatePhone",
                "click .code_img": "toResetValidateCode"
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
                self.$el.html(TplSource);
            },

            onShow: function () {
                var noCheck = Lizard.P("noCheck");
                self.setHeader();
                self.showLoading();

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
            }
        }
    );
    return View;
});