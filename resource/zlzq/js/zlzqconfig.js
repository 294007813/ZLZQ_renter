(function () {
    var baseUrl = 'resource/zlzq/js/';
	var isDebug = typeof location != 'undefined' && location.search.indexOf('debug=1') != -1;
	isDebug=true;
	var config = {
        paths: {
	        'Model': baseUrl + 'models/Model',
	        'Store': baseUrl + 'models/Store',
	        'BaseView': baseUrl + 'common/views/BaseView',
			'Config': baseUrl + 'common/config/config',
			'cUISlider': baseUrl + 'common/tools/cUISlider', //
	        'cUIImageSlider': baseUrl + 'common/tools/cUIImageSlider', //
			'cRange': baseUrl + 'common/tools/cRange', //
			'UITab':baseUrl + 'common/utils/ui.tab',
			//模版
			'TplSchedule': baseUrl + 'templates/schedule.html',
			'TplHouse': baseUrl + 'templates/house.html',
			'TplList': baseUrl + 'templates/list.html',
			'TplHList':baseUrl + 'templates/hlist.html',
	       	'TplComment': baseUrl + 'templates/comment.html',
			'TplOrder': baseUrl + 'templates/order.html',
			'TplSubscribe': baseUrl + 'templates/subscribe.html',
			'TplUser': baseUrl + 'templates/user.html',
			'TplPersonal': baseUrl + 'templates/personal.html',
			'TplContract': baseUrl + 'templates/contract.html',
			'TplAward': baseUrl + 'templates/award.html',
			'TplMyAward': baseUrl + 'templates/myaward.html',
			'TplMyRecord': baseUrl + 'templates/myrecord.html',
			'TplLogin': baseUrl + 'templates/login.html',
			'TplRegister': baseUrl + 'templates/register.html',
			'TplMyorder':baseUrl + 'templates/myorder.html',
			'TplOrderList':baseUrl + 'templates/orderlist.html',
			'TplOrderDetail':baseUrl + 'templates/orderdetail.html',
			'TplNewIndex':baseUrl + 'templates/newindex.html',
			'TplDecorateDetail':baseUrl + 'templates/decoratedetail.html',
			'TplDecorateList':baseUrl + 'templates/decoratelist.html',
			'TplWeChat':baseUrl + 'templates/wechat.html',
	    }
	};
	config.urlArgs = "v=1";
    if (isDebug) {
        config.urlArgs = "v="+Date.now();
    }
    require.config(config);

})();