define(['cStore', 'cCoreInherit'], function (cStore, cCoreInherit) {
    var YGBStore = {
       
		loginStore : new cCoreInherit.Class(cStore, {
			__propertys__: function () {
				this.key = 'S_YGB_COMMON_LOGIN_STATUS';
				this.lifeTime = '1D';
				this.defaultData = {"isLogin":false,"Auth":null};
			},
			initialize: function ($super, options) {
				$super(options);
			}
		}),

		detailStore : new cCoreInherit.Class(cStore, {
			__propertys__: function () {
				this.key = 'S_YGB_DETAIL_ID_STATUS';
				this.lifeTime = '1D';
				this.defaultData = {"isLogin":false,"Auth":null};
			},
			initialize: function ($super, options) {
				$super(options);
			}
		}),

		bankStore : new cCoreInherit.Class(cStore, {
			__propertys__: function () {
				this.key = 'S_YGB_BANK_ID_STATUS';
				this.lifeTime = '1D';
			},
			initialize: function ($super, options) {
				$super(options);
			}
		}),

		giftStore : new cCoreInherit.Class(cStore, {
			__propertys__: function () {
				this.key = 'S_YGB_GIFT_ID_STATUS';
				this.lifeTime = '365D';
			},
			initialize: function ($super, options) {
				$super(options);
			}
		}),
		appStore : new cCoreInherit.Class(cStore, {
			__propertys__: function () {
				this.key = 'S_YGB_APP_ID_STATUS';
				this.lifeTime = '1D';
				this.defaultData = {"app":true};
			},
			initialize: function ($super, options) {
				$super(options);
			}
		}),
		registerStore : new cCoreInherit.Class(cStore, {
			__propertys__: function () {
				this.key = 'S_YGB_COMMON_REGISTER_STATUS';
				this.lifeTime = '1D';
				this.defaultData = {"isLogin":false,"Auth":null};
			},
			initialize: function ($super, options) {
				$super(options);
			}
		})
	};
	
    return YGBStore;
});
