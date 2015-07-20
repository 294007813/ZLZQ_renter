//验证身份证
define([], function() {
    var inArray = function(array, val, from) {
        var i, len;
        if (from == null) {
            from = 0;
        }
        len = array.length;
        if (from < 0) {
            from += len;
        }
        i = Math.max(from, 0);
        while (i < len) {
            if (array[i] === val) {
                return i;
            }++i;
        }
        return -1;
    };
    var areaCode = '11@22@35@44@53@12@23@36@45@54@13@31@37@46@61@14@32@41@50@62@15@33@42@51@63@21@34@43@52@64@65@71@81@82@91';

    return {
        checkId : function(idcard) {
            var reg, Y, JYM, JYM_X, S, M, M_X;
            var arr_idcard = idcard.split('');
            var _ret = true;
            if (inArray(areaCode.split('@'), idcard.substr(0, 2)) === -1) {
                _ret = false;
            }
            /*身份号码位数及格式检验*/
            switch (idcard.length) {
                case 15:
                    if ((parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0 || ((parseInt(idcard.substr(6, 2)) + 1900) % 100 == 0 && (parseInt(idcard.substr(6, 2)) + 1900) % 400 == 0)) {
                        reg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/; //测试出生日期的合法性
                    } else {
                        reg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/; //测试出生日期的合法性
                    }
                    if (!reg.test(idcard)) {
                        _ret = false;
                    }
                    break;
                case 18:
                    if (parseInt(idcard.substr(6, 4)) % 4 == 0 || (parseInt(idcard.substr(6, 4)) % 100 == 0 && parseInt(idcard.substr(6, 4)) % 4 == 0)) {
                        reg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/; //闰年出生日期的合法性正则表达式
                    } else {
                        reg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/; //平年出生日期的合法性正则表达式
                    }
                    if (reg.test(idcard)) { //测试出生日期的合法性
                        //计算校验位
                        S = (parseInt(arr_idcard[0]) + parseInt(arr_idcard[10])) * 7 + (parseInt(arr_idcard[1]) + parseInt(arr_idcard[11])) * 9 + (parseInt(arr_idcard[2]) + parseInt(arr_idcard[12])) * 10 + (parseInt(arr_idcard[3]) + parseInt(arr_idcard[13])) * 5 + (parseInt(arr_idcard[4]) + parseInt(arr_idcard[14])) * 8 + (parseInt(arr_idcard[5]) + parseInt(arr_idcard[15])) * 4 + (parseInt(arr_idcard[6]) + parseInt(arr_idcard[16])) * 2 + parseInt(arr_idcard[7]) * 1 + parseInt(arr_idcard[8]) * 6 + parseInt(arr_idcard[9]) * 3;
                        Y = S % 11;
                        M = "F";
                        JYM = "10x98765432";
                        JYM_X = "10X98765432";
                        M = JYM.substr(Y, 1); /*判断校验位*/
                        M_X = JYM_X.substr(Y, 1); /*判断校验位*/
                        if (M != arr_idcard[17] && M_X != arr_idcard[17]) {
                            _ret = false;
                        }
                    } else {
                        _ret = false;
                    }
                    break;
                default:
                    _ret = false;
                    break;
            }
            return _ret;
        },
        parseId: function (str) {//根据身份证返回出生日期
            var sex, age;
            if (str.length == 15) {
                sex = parseInt(str.charAt(14), 10) % 2 ? 'M' : 'F';
                age = str.replace(/^\d{6}(\d{2})(\d{2})(\d{2}).+$/, "19$1-$2-$3");
            } else {
                sex = parseInt(str.charAt(16), 10) % 2 ? 'M' : 'F';
                age = str.replace(/^\d{6}(\d{4})(\d{2})(\d{2}).+$/, "$1-$2-$3");
            }
            return {
                sex: sex,
                age: age
            };
        }
    }
})