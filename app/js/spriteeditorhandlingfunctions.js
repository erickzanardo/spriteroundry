(function($) {
    var sprite;
    var chooser;
    var chooserCallback = null;

    chooseFile = function(callback) {
      chooserCallback = callback;
      chooser.trigger('click');
    };

    spriteEditorHandlingBinds = function(s, drawCanvas, bindSideImage) {
        sprite = s;

        $(".toolbar .invertx").click(function() {
            var canvas = $("div.board canvas");
            var index = canvas.data("foundry.index");
            var m = sprite.sprites[index];

            var middle = Math.floor(m[0].length / 2);

            for (var y in m) {
                for (var i = 0; i < middle; i++) {
                    var j = m[y].length - (i + 1);
                    var aux = m[y][j];
                    m[y][j] = m[y][i];
                    m[y][i] = aux;
                }
            }
            drawCanvas(canvas, m);
            setTimeout(function() {
                bindSideImage(m, index);
            }, 1000);
        });

        $(".toolbar .inverty").click(function() {
            var canvas = $("div.board canvas");
            var index = canvas.data("foundry.index");
            var m = sprite.sprites[index];

            var middle = Math.floor(m.length / 2);

            for (var y = 0; y < middle; y++) {
                var j = m.length - (y + 1);
                var aux = m[j];
                m[j] = m[y];
                m[y] = aux;
            }

            drawCanvas(canvas, m);
            setTimeout(function() {
                bindSideImage(m, index);
            }, 1000);
        });

        $(".toolbar .translate").click(function() {
            $("div.translatedialog").xdialog({
                overlay: '#23557E',
                alpha: '3'
            });
        });

        var translateX = function(x, m) {

            for (var i = 0; i < m.length; i++) {
                if (x > 0) {
                    for (var j = m[i].length; j > 0; j--) {
                        var v = m[i][j];
                        m[i][j] = null;
                        var index = parseInt(j) + x;
                        if (index < m[i].length ) {
                            m[i][index] = v;
                        }
                    }
                } else {
                    for (var j = 0; j < m[i].length; j++) {
                        var v = m[i][j];
                        m[i][j] = null;
                        var index = x + parseInt(j);
                        if (index >= 0 ) {
                            m[i][index] = v;
                        }
                    }
                }
            }
        };

        var translateY = function(y, m) {
            if (y > 0) {
                for (var i = m.length - 1; i > 0; i--) {
                    var v = m[i];
                    m[i] = new Array(m[i].length);

                    var index = parseInt(i) + y;
                    if (index < m.length ) {
                        m[index] = v;
                    }
                }
            } else {
                for (var i = 0; i < m.length; i++) {
                    var v = m[i];
                    m[i] = new Array(m[i].length);

                    var index = y + parseInt(i);
                    if (index >= 0 ) {
                        m[index] = v;
                    }
                }
            }
        };

        $(".translatedialog .buttons .ok").click(function() {
            var canvas = $("div.board canvas");
            var index = canvas.data("foundry.index");
            var m = sprite.sprites[index];

            $(".translatedialog input[type=text]").each(function() {
                var value = parseInt($(this).val());

                if (!isNaN(value)) {
                    var me = $(this);

                    if (me.is(".up")) {
                        translateY(value * -1, m);
                    }
                    if (me.is(".down")) {
                        translateY(value, m);
                    }

                    if (me.is(".left")) {
                        translateX(value * -1, m);
                    }

                    if (me.is(".right")) {
                        translateX(value, m);
                    }
                }
            });

            $("div.translatedialog").xundialog();
            $(".translatedialog input[type=text]").val("");
            drawCanvas(canvas, m);
            setTimeout(function() {
                bindSideImage(m, index);
            }, 1000);
        });

        $(".translatedialog input[type=text]").keyup(function(e) {
            if (e.which == 13) {
                $(".translatedialog .buttons .ok").click();
            }
        });

        $(".translatedialog .buttons .cancel").click(function() {
            $("div.translatedialog").xundialog();
            $(".translatedialog input[type=text]").val("");
        });
    };
})(jQuery);