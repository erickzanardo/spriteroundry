(function($) {
  exporter = function(path, thisSpriteSheet, callback) {
    var transparent = {r: 0, g: 0, b: 0, a: 0};
    var colorCache = {};
    var hexToRgb = function(hex) {
      if (!colorCache[hex]) {
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });
    
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        colorCache[hex] = result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : transparent;
      }
      return colorCache[hex];
    };

    var spriteSheetColumns = thisSpriteSheet.spriteSheetColumns;
    var sprites = [].concat(thisSpriteSheet.sprites);
    
    var collumns = thisSpriteSheet.collumns;
    var rows = thisSpriteSheet.rows;

    var spriteWidth = thisSpriteSheet.width;
    var spriteHeight = thisSpriteSheet.height;

    var pixelWidth = spriteWidth / collumns;
    var pixelHeight = spriteHeight / rows;

    var imageWidth = spriteWidth * spriteSheetColumns;
    var imageHeight = spriteHeight * Math.ceil(sprites.length / spriteSheetColumns);

    var relativeX = 0;
    var relativeY = 0;
    
    var ImageJS = require("imagejs");
    var bitmap = new ImageJS.Bitmap({width: imageWidth, height: imageHeight});
    
    var spritesDrawOnLine = 0;
    var linesDraw = 0;

    while(sprites.length) {
      var sprite = [].concat(sprites.shift());
      while (sprite.length) {
        var row = [].concat(sprite.shift());
        while (row.length) {
          var current = row.shift();
          var color = transparent;
          if (current) {
            color = hexToRgb(current);
          }
          for (var x = 0; x < pixelWidth; x++) {
            for (var y = 0; y < pixelHeight; y++) {
              bitmap.setPixel(relativeX + x,
                              relativeY + y,
                              color);
            }
          }
          relativeX += pixelWidth;
          if (!row.length) {
            relativeX = spritesDrawOnLine * spriteWidth;
          }
        }
        relativeY += pixelHeight;
      }
      spritesDrawOnLine++;
      if (spritesDrawOnLine == spriteSheetColumns) {
        linesDraw++;
        spritesDrawOnLine = 0;
      }
      relativeX = spritesDrawOnLine * spriteWidth;
      relativeY = linesDraw * spriteHeight;
    }

    bitmap.writeFile(path, { quality: 100 }).then(function() {
      callback();
    });
  }
  
})(jQuery);