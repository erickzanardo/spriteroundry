(function($) {

    jQuery.ajaxSetup({
        loading : true
    });

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
        if (!location.hash || location.hash == '#') {
            location = '#index';
            return;
        }

        var hash = location.hash.substring(1);
        if (hash.indexOf("/")) {
            hash = hash.split("/")[0];
        }
        if (pages[hash]) {
            pages[hash]();
        }
    });

    spritefoundry.load = function(url, param, callback) {
        $.ajax({
            url : url,
            dataType : 'holy',
            param : param,
            success : callback
        });
    };

    pages["usersprites"] = function(){
        if (!spritefoundry.user) {
            location.href = "#index";
            return;
        }
        $.ajax({
            url: "r/spritesheet",
            contentType: "application/json;charset=UTF-8",
            data: {
                query : JSON.stringify({
                    type: "json",
                    filter: {user: {EQ: spritefoundry.user.email}}
                })
            },
            success: function(result) {
                spritefoundry.load('pages/templates/usersprites.xml', result);
            }
        });
    };

    pages["index"] = function(){
        $.holy('pages/templates/index.xml');
    };

    pages["about"] = function(){
        $.holy('pages/templates/about.xml');
    };

    pages["sprite"] = function(){
        var json = "r/spritesheet/" + location.hash.getLastNode();
        $.getJSON(json, function(sprite){
            spritefoundry.load('pages/templates/sprite.xml', sprite);
        });
    };

    $(document).ready(function() {

        $.loading({
            text : 'Carregando...',
            overlay : '#23557E',
            opacity: '60'
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

        var parseNewDialog = function() {
            var w = parseInt($("div.newSpriteDialog .spriteWidth").val());
            var h = parseInt($("div.newSpriteDialog .spriteHeight").val());
            var c = parseInt($("div.newSpriteDialog .spriteCollumns").val());
            var r = parseInt($("div.newSpriteDialog .spriteRows").val());;
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

            if (spritefoundry.user) {
                spriteSheet.user = spritefoundry.user.email;
                $.ajax({
                    url: "r/spritesheet",
                    type: "POST",
                    contentType: "application/json;charset=UTF-8",
                    data: JSON.stringify(spriteSheet),
                    success: function(id) {
                        $("div.newSpriteDialog").xundialog();
                        $("div.newSpriteDialog input[type=text]").val("");
                        location.href = "#sprite/" + id.getLastNode();
                    }
                });
            } else {
                $("div.newSpriteDialog").xundialog();
                spritefoundry.load('pages/templates/sprite.xml', spriteSheet);
            }
        });

        $.ajax({
            url: "s/loggeduser",
            cache: false,
            success: function(user) {
                spritefoundry.user = user;

                var html = $("<span>Welcome back " + user.name + "</span>! <a href='#usersprites'>Click here to see your spritesheets</a> <a href='/s/logout' class='logout'><img src='/imgs/logout.png'/><a/>" )
                html.find("a").attr("href", "#");
                $("div.userlogpanel").html(html);
                $("div.userlogpanel").fadeIn();
            },
            error: function() {
                $("div.userlogpanel").fadeIn();
            }
        });
        $(window).hashchange();
    });

})(jQuery);