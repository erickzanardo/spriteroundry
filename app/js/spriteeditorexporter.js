(function($) {
    $.fn.spriteSheetImage = function(spriteSheet, c) {
        var sprites = [];

        var cellW = spriteSheet.width / spriteSheet.collumns;
        var cellH = spriteSheet.height / spriteSheet.rows;

        var w = spriteSheet.width;
        var h = spriteSheet.height;

        for (var i in spriteSheet.sprites) {
            var canvas = $("<canvas/>");
            canvas.attr("width", w);
            canvas.attr("height", h);

            canvas.width(w);
            canvas.height(h);

            var sprite = spriteSheet.sprites[i];

            canvas.drawSprite( {
                sprite : sprite,
                cellW : cellW,
                cellH : cellH
            });

            sprites.push(canvas);
        }

        var lines = Math.ceil(sprites.length / c);

        var iw = (w * c);
        var ih = (h * lines);
        var imageCanvas = $("<canvas/>");
        imageCanvas.attr("width", iw);
        imageCanvas.attr("height", ih);
        imageCanvas.width(iw);
        imageCanvas.height(ih);

        var ctx = imageCanvas[0].getContext("2d");

        var x = 0;
        var y = 0;

        for (var i in sprites) {
            var spriteCanvas = sprites[i];

            ctx.drawImage(spriteCanvas[0], x * w, y * h);

            x++;
            if (x == c) {
                x = 0;
                y++;
            }
        }

        $(this).attr("src", imageCanvas[0].toDataURL())
    };
})(jQuery);