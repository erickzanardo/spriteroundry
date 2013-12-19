(function($) {

    var crtl = false;

    var keySelectors = {
            66 : "div.toolbar img.brush",
            69 : "div.toolbar img.eraser",
            70 : "div.toolbar img.fill",
            77 : "div.toolbar img.move",
            83 : "div.tollbar input.saveButton",
            78 : "div.tollbar input.newButton",
            89 : ".handlingtollbar .inverty",
            88 : ".handlingtollbar .invertx"
    };

    var shotkeysdown = function(e) {
        if (e.which == 16) {
            crtl = true;
        }
    };

    var shotkeysup = function(e) {
        if (e.which == 16) {
            crtl = false;
        }

        if (crtl && keySelectors[e.which]) {
            var obj = $(keySelectors[e.which]);
            if (obj.length) {
                obj.click();
                return false;
            }
        }
    };

    $(document).ready(function() {
        $(document).keyup(shotkeysup);
        $(document).keydown(shotkeysdown);
    });
})(jQuery);