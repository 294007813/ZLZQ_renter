define(['BaseView', "cUIInputClear","cUIImageSlider" ,"Model", "Store","UIGroupSelect","UIAlert","text!TplContract"], function (BaseView, cUIInputClear,cUIImageSlider, Model, Store,UIGroupSelect,cUIAlert,tplContract) {
    var self;
    var View = BaseView.extend({
        ViewName: 'contract',
        events: {
            "click .housing .btn":"toReserve",
            "click .location_icon" :"toLocation",
            "click .search-btn":"toSearch",
            "click .contract-list li":"toContract",
            "click .check":"selectDate"
        },
        toContract: function (e) {


            if( self.$el.find(".contract-box").hasClass("transformRightSideOut")){
                self.$el.find(".contract-list-box").addClass("transformOut");
                self.$el.find(".contract-box").removeClass("transformRightSideOut");
            }else {
                self.$el.find(".contract-box").show();
                self.$el.find(".contract-list-box").addClass("transition");
                self.$el.find(".contract-list-box").addClass("transformOut");
                self.$el.find(".contract-box").addClass("transformRightSideIn");
            }

            self.setDeleteHeader();

          // self.$el.find(".contract-box").show();
        },
        setDeleteHeader:function(){
            self.header.set({
                title: '房屋租赁合同',
                back: true,
                backtext: '<i class="icon-back "></i> ',
                view: this,
                btn: {
                    title: '删除',
                    id: 'confirm-btn',
                    classname: 'right_btn'
                },
                events: {
                    returnHandler: function () {
                        self.setHeader();
                        self.$el.find(".contract-box").addClass("transformRightSideOut");
                        self.$el.find(".contract-list-box").removeClass("transformOut");

                    },
                    commitHandler: function () {

                    self.confirmBox = self.confirmBox ||new cUIAlert({
                            datamodel: {
                                title: '',
                                content: "确认删除该租赁合同，删除后的合同将无法恢复。",
                                btns: [
                                    {name: '取消', className: 'cui-confirm-ok'},
                                    {name: '删除', className: 'cui-confirm-ok'}
                                ]
                            },
                            events: {
                                'click .cui-confirm-no': 'noAction',
                                'click .cui-confirm-ok': 'okAction'
                            },
                            okAction: function () {
                                this.hide();
                             //   self.reset();


                            },
                            noAction: function () {
                                this.hide();
                                //   self.reset();


                            }
                        });
                        self.confirmBox.show();

                    }
                }
            });
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

            self.hideLoading();
            self.showMyToast('网络错误，请重试', 2000);
        },

        onCreate: function () {
            self = this;

        },
        onShow: function () {
            self.$el.html(tplContract);

            self.setHeader();
            self.hideLoading();

        },
        setAddHeader:function(){

            self.header.set({
                title: '房屋租赁合同',
                back: true,
                backtext: '<i class="icon-back "></i> ',
                view: this,
                btn: {
                    title: '保存',
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
        //设置标题
        setHeader: function () {
            self.header.set({
                title: '合同管理',
                back: true,
                backtext: '<i class="icon-back "></i> ',
                view: this,
                btn: {
                    title: '新增',
                    id: 'confirm-btn',
                    classname: 'right_btn'
                },
                events: {
                    returnHandler: function () {

                        Lizard.goTo("user.html");

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
