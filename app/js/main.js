(function($) {

    jQuery.ajaxSetup({
        loading : true
    });

    var chooserNew;
    var chooserNewCallback = null;

    chooseFileForSave = function(callback) {
      chooserNewCallback = callback;
      chooserNew.trigger('click');
    };

    var chooserOpen;
    var chooserOpenCallback = null;

    chooseFileForOpen = function(callback) {
      chooserOpenCallback = callback;
      chooserOpen.trigger('click');
    };

    String.prototype.getLastNode = function(s) {
        if (!s) {
            s = 1;
        }
        var array = this.split('/');
        if (s >= array.length) {
            return array.join('/');
        }
        var ret = '';
        for ( var i = 0; i < s; i++) {
            ret = ret + array[array.length - s + i];
            if (i < s - 1) {
                ret += '/';
            }
        }
        return ret;
    };

    pages = [];

    spritefoundry = {};

    $(window).hashchange(function() {
        var hash = location.hash.substring(1);
        if (hash.indexOf("/")) {
            hash = hash.split("/")[0];
        }
        if (pages[hash]) {
            pages[hash]();
        }
    });

    spritefoundry.load = function(url, param, callback) {
      alert('asd');
        $.ajax({
            url : url,
            dataType : 'holy',
            param : param,
            success : callback
        });
    };

    var openSprite = function(spriteSheet) {
      spritefoundry.load('pages/templates/sprite.xml', spriteSheet, function() {
        $(".translatedialog").hide();
        $(".ttip").tipsy();
        $("div.newSpriteDialog").xundialog();
        spriteEditorBinds(spriteSheet);
      });
    };

    $(document).ready(function() {
        $.loading({
            text : 'Carregando...',
            overlay : '#23557E',
            opacity: '60'
        });

        chooserNew = $('#saveFileDialog');
        chooserNew.change(function(evt) {
          var path = $(this).val();
          chooserNewCallback(path);
          chooserNewCallback = null;
        });

        chooserOpen = $('#openFileDialog');
        chooserOpen.change(function(evt) {
          var path = $(this).val();
          chooserOpenCallback(path);
          chooserOpenCallback = null;
        });

        $("div.newSpriteDialog input[type=text]").keypress(function(e) {
            if (e.which == 13) {
                $("div.newSpriteDialog .okbutton").click();
            }
        });

        $("div.newsprite a").click(function() {
            $("div.newSpriteDialog div.preview").hide();
            $("div.newSpriteDialog").xdialog({
                overlay: '#23557E',
                alpha: '3'
            });
            $("div.newSpriteDialog input.name").focus();
            return false;
        });

        $("div.loadsprite a").click(function() {
          chooseFileForOpen(function(path) {
            var fs = require('fs');
            fs.readFile(path, 'utf8', function(err, data) {
              var spriteSheet = JSON.parse(data);
              openSprite(spriteSheet);
            });
          });
        });

        var parseNewDialog = function() {
            var w = parseInt($("div.newSpriteDialog .spriteWidth").val());
            var h = parseInt($("div.newSpriteDialog .spriteHeight").val());
            var c = parseInt($("div.newSpriteDialog .spriteCollumns").val());
            var r = parseInt($("div.newSpriteDialog .spriteRows").val());
            var n = $("div.newSpriteDialog .name").val();

            var valid = true;
            if (!n) {
                valid = false;
            }

            if (isNaN(w) || w <= 0) {
                valid = false;
            }

            if (isNaN(h) || h <= 0) {
                valid = false;
            }

            if (isNaN(r) || r <= 0) {
                valid = false;
            }

            if (isNaN(c) || c <= 0) {
                valid = false;
            }

            if (valid) {
                return {w: w, h: h, c: c, r: r, name: n};
            }
            return undefined;
        };

        $("div.newSpriteDialog input[type=text]").keyup(function() {
            var info = parseNewDialog();
            if (info) {

                var cellW = info.w / info.c;
                var cellH = info.h / info.r;

                var div = $("div.newSpriteDialog div.preview");

                var span = div.find("div.proportion span");
                var proportionText = cellW == cellH ? "is proportional" : "is not proportional";
                span.text(proportionText);

                var canvas = $("div.newSpriteDialog div.preview canvas");

                canvas.attr("width", info.w);
                canvas.attr("height", info.h);

                canvas.width(info.w);
                canvas.height(info.h);

                var right = div.width() + 20;
                div.css("right", right * -1);

                $("div.newSpriteDialog div.preview").show();

                canvas.drawGrid(info.r, info.c, cellW, cellH, true);
            }
        });

        $("div.newSpriteDialog .okbutton").click(function() {
            var result = parseNewDialog();

            if (!result) {
                $("div.newSpriteDialog").shakeDialog(10, "left");
                return;
            }

            var spriteSheet = {
                    name: result.name,
                    width: result.w, 
                    height: result.h, 
                    collumns: result.c, 
                    rows: result.r,
                    colors: ["#000"],
                    sprites: []};

            var s = [];
            for (var i = 0; i < result.r; i++) {
                s.push(new Array(result.c));
            }
            spriteSheet.sprites.push(s);
            openSprite(spriteSheet);
        });
    });

})(jQuery);