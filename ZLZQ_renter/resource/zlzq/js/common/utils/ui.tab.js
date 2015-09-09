define("text!ui.tab.html", [], function() {
    return function(obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with (obj || {}) {
            __p += '<ul class="cui-tab-mod">';
            for (var i = 0, len = data.length; len > i; i++)
                __p += '<li data-key="' + (null == (__t = data[i].id) ? "" : __t) + '" data-index="' + (null == (__t = i) ? "" : __t) + '" ', i == index && (__p += 'class=" ' + (null == (__t = curClass) ? "" : __t) + '"'), __p += ">" + (null == (__t = data[i].name) ? "" : __t) + "</li>";
            __p += '<i class="cui-tab-scrollbar cui-tabnum' + (null == (__t = len) ? "" : __t) + '"></i></ul>'
        }
        return __p
    }
}), define(["UIView", "text!ui.tab.html"], function(t, a) {
    return _.inherit(t, {propertys: function($super) {
        $super(), this.template = a, this.datamodel = {data: [],curClass: "cui-tab-current",index: 0}, this.events = {"click .cui-tab-mod>li": "clickAction"}, this.onChange = function() {
            console.log(arguments)
        }
    },resetPropery: function() {
        if ((this.datamodel.index < 0 || this.datamodel.index > this.datamodel.data.length) && (this.datamodel.index = 0), !this.datamodel.selectedKey)
            return void (this.datamodel.selectedKey = this.datamodel.data[this.datamodel.index].id);
        for (var t = 0, a = this.datamodel.data.length; a > t; t++)
            if (this.datamodel.selectedKey == this.datamodel.data[t].id) {
                this.datamodel.index = t;
                break
            }
    },initElement: function() {
        this.el = this.$(".cui-tab-current"), this.tab = this.$(".cui-tab-scrollbar"), this.tabs = this.$("li")
    },clickAction: function(t) {
        {
            var a = $(t.currentTarget), i = a.attr("data-index");
            this.datamodel.data[i]
        }
        this.setIndex(i)
    },setVal: function(t) {
        this.el = this.$('li[data-key="' + t + '"]');
        var a = this.el.attr("data-index"), i = this.datamodel.data[a];
        if (!i)
            return void console.log("设置值有误");
        var e = this.datamodel.selectedKey == t;
        if (this.datamodel.selectedKey = t, this.tabs.removeClass(this.datamodel.curClass), this.el && this.el.addClass(this.datamodel.curClass), navigator.userAgent.toLowerCase().indexOf("android") > -1 && $(window).height() > 530) {
            this._tab = this.$el.find(".cui-tab-scrollbar");
            var d = this._tab.css("width");
            setTimeout($.proxy(function() {
                this._tab.css("width", d)
            }, this), 0)
        }
        0 == e && "function" == typeof this.onChange && this.onChange.call(this, i)
    },getVal: function() {
        return this.datamodel.selectedKey
    },setIndex: function(t) {
        0 > t || t > this.datamodel.data.length - 1 || this.setVal(this.datamodel.data[t].id)
    },getIndex: function() {
        for (var t = 0, a = this.datamodel.data.length; a > t; t++)
            if (this.getVal() == this.datamodel.data[t].id)
                return t;
        return -1
    },initialize: function($super, t) {
        $super(t)
    },addEvent: function($super) {
        $super()
    }})
});
