define(['cPageView', 'cGuider', 'cUtility','Store','Model', 'UIAlert',], function (cPageView, cGuider, cUtility,Store,Model, UIAlert) {
    var isInApp = cUtility.isInApp;
    var Guider = cGuider;
	var loginStore=Store.loginStore.getInstance();
	var detailStore = Store.detailStore.getInstance();



	var bankStore = Store.bankStore.getInstance();
	Lizard.host="http://zlzq.easybird.cn/";
	Lizard.apiUrl="api/v1/";
	Lizard.version="2.15";
	var viewBaseUrl="";
	Lizard.timeout=20000;
    var BaseView = cPageView.extend({
	    //scrollZero:false,
		 emptyContentNode: function () {
            return false;
        },
		showMyToast: function (msg, time) {
			this.showToast({
				datamodel: {
					content: msg
				},
				maskToHide: false,
				hideSec: time
			});
		},

		toRent:function(e){
			Lizard.goTo("newindex.html");
		},

		toOrderList:function(){
			if(this.isLogin()){
				Lizard.goTo("orderlist.html");
			}else {
				Lizard.goTo("login.html");
			}
		},

		toOrder:function(e){
			Lizard.goTo("order.html");
		},
		toPersonal:function(e){
			if(this.isLogin()){
				Lizard.goTo("user.html");
			}else{
				Lizard.goTo("login.html");
			}

		},
		toSchedule:function(e){
			Lizard.goTo("schedule.html");
		},
		//toOrder:function(e){
		//	Lizard.goTo("order.html");
		//},

		toSearch:function(e) {
			this.$el.find(".searchBar").toggleClass("active");
			var addr = $.trim(this.$el.find(".search-box").val());
			if (addr) {
				Lizard.goTo("list.html?addr=" + encodeURIComponent(addr));
				return;
			}
			Lizard.goTo("list.html");
		},
		toLocation:function(){
			Lizard.goTo("index.html");
		},
	    showLoading:function(){
			$("#loading").removeClass("hideLoading");
		    $("#loading").show();
		},
		hideLoading:function(){
		    $("#loading").hide();
		},
		isLogin:function(){
		    return loginStore.get().isLogin;
		},
		getCurrentUser:function(){
			return loginStore.get().user;
		},
		toFavorite:function(e){
			Lizard.goTo("list.html?favorite=1");
		},
		setLoginStatus:function(data){
			loginStore.set(data);
		},
		reScrollTop:function(top){
		    window.scrollTo(0,top);
		},
		goToView:function(viewName){
			if(this.isWeiXin()){
				if(viewName=="login"){
					window.location.href="/";
					return;
				}
			}
			var viewname=viewName.split("?")[0];
			var param=viewName.split("?")[1] ? '?'+viewName.split("?")[1] : '';
			Lizard.goTo(viewBaseUrl+'/'+viewname+'.html'+param);
		},
        isIOS: !!$.os && !!$.os.iphone,
		moneySeparate: function(smoney){
			var money = smoney.toString().split('.');
			return money[0].replace(/(\d{1,3})(?=(\d{3})+$)/g, '$1,') + (_.isUndefined(money[1]) ? '' : '.' + money[1]);
		},
		removeStore: function(){
			if(!_.isEmpty(detailStore)){
				detailStore.remove();
			}
			if(!_.isEmpty(loginStore)){
				loginStore.remove();
			}
			if(!_.isEmpty(bankStore)){
				bankStore.remove();
			}
		},
		goDetail: function(){
			if(!_.isEmpty(detailStore) && !_.isNull(detailStore.getAttr('goList'))){
				Lizard.goTo(viewBaseUrl+'/detail.html?pid=' + detailStore.getAttr('pid'));
			}
			else{
				Lizard.goTo(viewBaseUrl+'/product_list.html');
			}
		},
		checkMobile:function(mobile){
		    mobile=mobile||"";
		    return  mobile.length==11 && /^0?1[123456789]\d{9}$/.test(mobile);
		},
		//下载
		downApp: function(){
			window.open ("http://m.yuangongbao.com/app", "", "height=400, width=400, toolbar =no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
			//Lizard.jump('http://m.yuangongbao.com/app');
		},
		//投资
		invest: function(pid, type){
			var self = this;
			self.showLoading();
			buyModel.param = {'pid': pid};
			buyModel.excute(function(json){
				self.hideLoading();
				var retCode = json.retCode;
				var retData =  json.retData;
				if(retCode == 0 && !_.isEmpty(retData)){
					if(type) {
						detailStore.setAttr('goList', true);
						detailStore.setAttr('pid', pid);
					}else{
						detailStore.remove();
					}
					if(retData.authStep == 0){
						if(!retData.canBuy){
							self.showToast('该产品暂时无法购买');
							return;
						}
						detailStore.setAttr('pid', pid);
					    detailStore.setAttr('productInfo', retData);
					    self.goToView('creat_order');
					}else{
						var fn = function(){
							if(retData.authStep == 1){
								self.goToView('verify_name');
							}
							else if(retData.authStep == 2){
								self.goToView('bind_card');
							}else{
								self.goToView('set_pay_psw');
							}
						}
						self.prompt('<p><strong style="font-size:14px">您尚未完成交易设置</strong></p><p>现在就去设置？</p>', fn);
					}
				}else if(retCode == 100002 || retCode == 100010){
					self.goToView('login');
				}else{
					self.showToast(json.retMsg || '网络错误，请稍后重试');
				}
			},function(){
				self.hideLoading();
				self.showToast('网络错误，请稍后重试');
			},false, this);
		},
		hideAlert: function(){
			if(this.promptAlert) this.promptAlert.hide();
		},
		prompt: function(str, fn, txt1, txt2){
			var self = this;
			self.promptAlert = new UIAlert({
					datamodel: {
						content: str,
						btns: [{
							name: !txt1 ? '取消' : txt1,
							className: 'cui-btns-ok'
						}, {
							name: !txt2 ? '好的' : txt2,
							className: 'cui-btns-no'
						}]
					},
					events: {
						'click .cui-btns-ok': 'okAction',
						'click .cui-btns-no': 'noAction'
					},
					okAction: function() {
						this.hide();
					},
					noAction: function() {
						this.hide();
						if(fn) fn();
					}
			});
			self.promptAlert.show();
		},
		fixedIos:function(obj){
			var ver=parseInt($.os.version);
			var isIOS= !!$.os && !!$.os.iphone && ver <8;
			if(isIOS){
			  var inputs=obj.find("input");
			  inputs.on("focus",function(){$("#headerview .cm-header").addClass("abs")});
			  inputs.on("blur",function(){$("#headerview .cm-header").removeClass("abs")})
			}
		},
		isWeiXin:function(){
			var ua = window.navigator.userAgent.toLowerCase();
			if(ua.match(/MicroMessenger/i) == 'micromessenger'){
				return true;
			}else{
				return false;
			}
	   },
		popWinHeight:function(){
			return $(window).height()-230;
		}
    });
    return BaseView;
});