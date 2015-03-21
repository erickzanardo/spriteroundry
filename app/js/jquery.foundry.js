(function($) {
    foundry = {};
    foundry.colorPicker = function(callback, color) {
        var div = $("<div class='colorpicker'><div class='picker'/><div class='preview'/><input type='button' value='Ok'/></div>");
        div.hide();
        div.appendTo("body");

        div.children("div.picker").farbtastic(function(c) {
            div.children("div.preview").css("background-color", c);
            div.children("div.preview").data("foundry.color", c);
        });

        if (color) {
            $.farbtastic(div.children("div.picker")).setColor(color);
        }

        div.children("input[type=button]").click(function() {
            callback(div.children("div.preview").data("foundry.color"));
            div.xundialog();
            div.remove();
        });

        div.xdialog({
            overlay: '#23557E',
            alpha: '3',
            onclose: function() {
                div.remove();
            }
        });
    };

    foundry.confirmDialog = function(opts) {
        if (!opts) {
            return;
        }
        var div = $('<div class="confirm-dialog pixel-modal"><div class="pixel-panel-body"></div><input type="button" class="yes pixel-button" value="Yes"/><input type="button" class="no pixel-button" value="No"/></div>');
        div.appendTo("body");

        div.children("div").text(opts.message);

        div.children(".yes").click(function() {
            if (opts.onconfirm) {
                opts.onconfirm();
            }
            pixelated.modal('.confirm-dialog', false);
            div.xundialog();
            div.remove();
        });

        div.children(".no").click(function() {
            if (opts.oncancel) {
                opts.oncancel();
            }
            pixelated.modal('.confirm-dialog', false);
            div.remove();
        });

        pixelated.modal('.confirm-dialog', true);
    };

    foundry.inputDialog = function(opts) {
        if (!opts) {
            return;
        }
        var div = $("<div class='inputDialog'><div/><input type='text'/><input type='button' class='ok' value='Ok'/><input type='button' class='cancel' value='Cancel'/></div>");
        div.hide();
        div.appendTo("body");

        div.children("div").text(opts.message);

        div.children(".ok").click(function() {
            var v = div.children("input[type=text]").val();
            if (v) {
                if (opts.onconfirm) {
                    opts.onconfirm(v);
                }
                div.xundialog();
                div.remove();
            } else {
                div.shakeDialog(10, "left");
            }
        });

        div.children(".cancel").click(function() {
            if (opts.oncancel) {
                opts.oncancel();
            }
            div.xundialog();
            div.remove();
        });

        div.xdialog({
            overlay: '#23557E',
            alpha: '3'
        });
    };

    $.fn.scrollDown = function() {
        $(this).animate({ scrollTop: $(this).prop("scrollHeight") }, 200);
    };

    $.fn.shakeDialog = function(times, direction) {
        var me = $(this);
        direction = direction || "all";

        if (direction == "top" || direction == "all") {
            var y = Math.floor(Math.random() * 10) * (Math.random() * 10 > 5 ? -1 : 1) ;
            me.css("top", (me.position().top + y) + "px");
        }

        if (direction == "left" || direction == "all") {
            var x = Math.floor(Math.random() * 10) * (Math.random() * 10 > 5 ? -1 : 1) ;
            me.css("left", (me.position().left + x) + "px");
        }

        times--;
        if (times > 0) {
            setTimeout(function() {
                me.shakeDialog(times, direction);
            }, 50);
        }
    }
})(jQuery);