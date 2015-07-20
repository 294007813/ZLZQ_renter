define('cRange', function () {
    var hasTouch = 'ontouchstart' in window,
        START_EV = hasTouch ? 'touchstart' : 'mousedown',
        MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
        END_EV = hasTouch ? 'touchend' : 'mouseup',
        CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup',
        range = function (id) {
            var that = this;
            that.el = document.getElementById(id);
            that.x = 0;
            that._bind(START_EV);
        }
    range.prototype = {
        handleEvent: function (e) {
            var that = this;
            switch (e.type) {
                case START_EV:
                    if (!hasTouch && e.button !== 0) return;
                    that._start(e);
                    break;
                case MOVE_EV:
                    that._move(e);
                    break;
                case END_EV:
                case CANCEL_EV:
                    that._end(e);
                    break;
                case 'mouseout':
                    that._mouseout(e);
                    break;
                case 'webkitTransitionEnd':
                    that._transitionEnd(e);
                    break;
            }
        },
        _start: function (e) {
            var that = this;
            if (!e.target.classList.contains("range-icon")) {
                return;
            }
            point = hasTouch ? e.touches[0] : e;
            that.pointX = point.pageX;
            that.pointY = point.pageY;

            that.distX = 0;
            that.distY = 0;
            that.absDistX = 0;
            that.absDistY = 0;

            that._bind(MOVE_EV);
            that._bind(END_EV);

        },
        _move: function (e) {
            var that = this,
                point = hasTouch ? e.touches[0] : e,
                deltaX = point.pageX - that.pointX,
                deltaY = point.pageY - that.pointY,
                newX = that.x + deltaX,
                newY = that.y + deltaY;

            that.pointX = point.pageX;
            that.pointY = point.pageY;

            that.distX += deltaX;
            that.distY += deltaY;
            that.absDistX = Math.abs(that.distX);
            that.absDistY = Math.abs(that.distY);

            if (that.absDistX < 6 && that.absDistY < 6) {
                return;
            }

            this.x = newX;
            this.y = newY;
            document.getElementById("icon").style.left = this.x + "px";
            document.getElementById("innerBar").style.width = this.x + "px";

        },
        _end: function (e) {
            var that = this;
            that._unbind(MOVE_EV);
            that._unbind(END_EV);
        },
        _bind: function (type, el, bubble) {
            (el || this.el).addEventListener(type, this, !!bubble);
        },
        _unbind: function (type, el, bubble) {
            (el || this.el).removeEventListener(type, this, !!bubble);
        }
    }
    return range;
})