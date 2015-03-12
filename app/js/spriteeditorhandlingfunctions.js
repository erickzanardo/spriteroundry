(function($) {
    var sprite;
    updateBindHandlerSprite = function(s) {
        sprite = s;
    }

    spriteEditorHandlingBinds = function(s, drawCanvas, bindSideImage) {
        sprite = s;
        $(".handlingtollbar .invertx").click(function() {
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

        $(".handlingtollbar .inverty").click(function() {
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

        $(".handlingtollbar .translate").click(function() {
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
        
//        window.onload = function() {
//            var input = document.getElementById('input');
//            input.addEventListener('change', handleFiles);
//        }
//
//        function handleFiles(e) {
//            var ctx = document.getElementById('canvas').getContext('2d');
//            ctx.drawImage(e.target.files[0], 20,20);
//            alert('the image is drawn');
//        }
        
//        function imageLoaded(ev) {
//            element = document.getElementById("cancan");
//            c = element.getContext("2d");
//
//            im = ev.target; // the image, assumed to be 200x200
//
//            // read the width and height of the canvas
//            width = element.width;
//            height = element.height;
//
//            // stamp the image on the left of the canvas:
//            c.drawImage(im, 0, 0);
//
//            // get all canvas pixel data
//            imageData = c.getImageData(0, 0, width, height);
//
//            w2 = width / 2;
//
//            // run through the image, increasing blue, but filtering
//            // down red and green:
//
//            for (y = 0; y < height; y++) {
//                inpos = y * width * 4; // *4 for 4 ints per pixel
//                outpos = inpos + w2 * 4
//                for (x = 0; x < w2; x++) {
//                    r = imageData.data[inpos++] / 3; // less red
//                    g = imageData.data[inpos++] / 3; // less green
//                    b = imageData.data[inpos++] * 5; // MORE BLUE
//                    a = imageData.data[inpos++];     // same alpha
//
//                    b = Math.min(255, b); // clamp to [0..255]
//
//                    imageData.data[outpos++] = r;
//                    imageData.data[outpos++] = g;
//                    imageData.data[outpos++] = b;
//                    imageData.data[outpos++] = a;
//                }
//            }
//
//            // put pixel data on canvas
//            c.putImageData(imageData, 0, 0);
//        }
//
//        im = new Image();
//        im.onload = imageLoaded;
//        im.src = "goat200.jpg"; // code assumes this image is 200x200
    };
})(jQuery);