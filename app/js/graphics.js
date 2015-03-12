(function($) {
    var drawSpriteInCanvas = function(ctx, sprite, cellW, cellH) {
        for ( var y in sprite) {
            for ( var x = 0; x < sprite[y].length; x++) {
                if (sprite[y][x]) {
                    ctx.fillStyle = sprite[y][x];
                    ctx.fillRect(x * cellW, y * cellH, cellW, cellH);
                    ctx.strokeStyle = sprite[y][x];
                    ctx.strokeRect(x * cellW, y * cellH, cellW, cellH);
                }
            }
        }
    }

    $.fn.drawSprite = function(opts) {
        var ctx = this[0].getContext("2d");
        ctx.clearRect(0, 0, opts.sprite[0].length * opts.cellW, opts.sprite.length * opts.cellH);

        drawSpriteInCanvas(ctx, opts.sprite, opts.cellW, opts.cellH);
    };

    $.fn.drawGhostSprite = function(opts) {
        var ctx = this[0].getContext("2d");

        ctx.globalAlpha = 0.4;
        drawSpriteInCanvas(ctx, opts.sprite, opts.cellW, opts.cellH);
        ctx.globalAlpha = 1;
    };

    $.fn.drawGrid = function(ylength, xlength, cellW, cellH, clear) {
        var w = $(this).width();
        var h = $(this).height();

        var ctx = this[0].getContext("2d");
        if (clear) {
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, w, h);
        }

        ctx.strokeStyle = "#303030";

        for ( var y = 0; y < ylength; y++) {
            ctx.strokeRect(0, y * cellH, w, h);
        }

        for ( var x = 0; x < xlength; x++) {
            ctx.strokeRect(x * cellW, 0, w, h);
        }
    }
})(jQuery);