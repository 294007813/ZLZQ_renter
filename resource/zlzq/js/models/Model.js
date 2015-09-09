define(['cCoreInherit', 'cModel'], function (CoreInherit, cModel) {
    var LZKModel = LZKModel || {};
    Lizard.restfullApi="http://zlzq.easybird.cn/api/v1";
    //产品列表
    LZKModel.ListModel = new CoreInherit.Class(cModel, {
        buildurl: function () {
            return Lizard.restfullApi + '/realties';
        },
        __propertys__: function () {
            this.param = {};
            this.method='GET';
            this.usehead = false;
        }
    });
    //产品详情
    LZKModel.DetailModel = new CoreInherit.Class(cModel, {
        buildurl: function () {
            return Lizard.restfullApi + '/product_detail';
        },
        __propertys__: function () {
            this.param = {};
            this.usehead = false;
        }
    });

   return LZKModel;

});