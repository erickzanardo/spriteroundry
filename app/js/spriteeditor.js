(function($) {

    var zoom = 0;
    var thisSpriteSheet;

    var drawCanvas = function(canvas, sprite, sidebar) {
        var cellW = canvas.width() / thisSpriteSheet.collumns;
        var cellH = canvas.height() / thisSpriteSheet.rows;


        canvas.drawSprite( {
            sprite : sprite,
            cellW : cellW,
            cellH : cellH
        });

        if (!sidebar) {
            if ($(".righttoolbar .showgrid").is(":checked")) {
                canvas.drawGrid(sprite.length, sprite[0].length, cellW, cellH);
            }

            if ($(".righttoolbar .viewlayer").is(":checked")) {

                var i = canvas.data("foundry.index");
                if (i > 0) {
                    var sprite2 = thisSpriteSheet.sprites[i - 1];
                    canvas.drawGhostSprite( {
                        sprite : sprite2,
                        cellW : cellW,
                        cellH : cellH
                    });
                }
            }
        }
    }

    var ajustCanvasBounds = function(canvas) {
        var w = thisSpriteSheet.width;
        var h = thisSpriteSheet.height;

        w *= 1 + (zoom / 100)
        h *= 1 + (zoom / 100)

        canvas.attr("width", w);
        canvas.attr("height", h);

        canvas.width(w);
        canvas.height(h);
    }

    var canvasMouseFunc = function(me, e, up) {

        var offset = me.offset();
        x = e.pageX - offset.left;
        y = e.pageY - offset.top;

        var cellW = me.width()
                / thisSpriteSheet.collumns;
        var cellH = me.height()
                / thisSpriteSheet.rows;

        x = Math.round((x - (x % cellW)) / cellW);
        y = Math.round((y - (y % cellH)) / cellH);

        var mySprite = thisSpriteSheet.sprites[me
                .data("foundry.index")];

        var changed = false;
        var selected = $(".canvas .board .toolbar img.selected");

        if (y > mySprite.length - 1) {
            return;
        }
        if (selected.is(".brush")) {
            var color = $("div.currentcolor").data("foundry.color");
            if (!color) {
                return;
            }
            changed = mySprite[y][x] != color;
            mySprite[y][x] = color;
        } else if (selected.is(".eraser")) {
            changed = mySprite[y][x] != undefined;
            mySprite[y][x] = undefined;
        } else if (selected.is(".fill") && up) {
            var color = $("div.currentcolor").data("foundry.color");
            if (!color) {
                return;
            }

            var colorToFille = mySprite[y][x];
            var list = [];

            var verifyFillCoord = function(y, x) {
                if (y < mySprite.length && y >= 0) {
                    if (x < mySprite[0].length && x >= 0) {
                        if (colorToFille == mySprite[y][x]) {
                            return $.inArray((y + "-" + x), list) == -1;
                        }
                    }
                }
                return false;
            };

            list.push(y + "-" + x);
            var fillTool = function() {
                if (list.length) {
                    var coords = list.pop().split("-");
                    var parsedY = parseInt(coords[0]);
                    var parsedX = parseInt(coords[1]);

                    var cy = parsedY;
                    var cx = parsedX;
                    mySprite[cy][cx] = color;

                    // DOWN
                    cy = parsedY + 1;
                    cx = parsedX;

                    if (verifyFillCoord(cy, cx)) {
                        list.push(cy + "-" + cx);
                    }

                    // UP
                    cy = parsedY - 1;
                    cx = parsedX;

                    if (verifyFillCoord(cy, cx)) {
                        list.push(cy + "-" + cx);
                    }

                    // LEFT
                    cy = parsedY;
                    cx = parsedX -1;

                    if (verifyFillCoord(cy, cx)) {
                        list.push(cy + "-" + cx);
                    }

                    // LEFT
                    cy = parsedY;
                    cx = parsedX + 1;

                    if (verifyFillCoord(cy, cx)) {
                        list.push(cy + "-" + cx);
                    }

                    fillTool();
                }
            }
            fillTool();
            changed = true;
        }

        if (changed) {
            drawCanvas(me, mySprite);
        }

        var i = me.data("foundry.index");
        setTimeout(function() {
            bindSideImage(mySprite, i);
        }, 1000);
        return selected.is(".move");
    };
    
    var createSpriteCanvas = function(myIndex) {
        var canvas = $("<canvas />");
        canvas.prependTo(".canvas .board");
        canvas.hide();
        canvas = $(".canvas .board canvas");

        ajustCanvasBounds(canvas);

        canvas.data("foundry.index", myIndex);

        canvas.mousedown(function() {
            $(this).data("foundry.down", true);
        });

        canvas.mouseup(function(e) {
            $(this).data("foundry.down", false);
            return canvasMouseFunc($(this), e, true);
        });

        canvas.mousemove(function(e) {
            var me = $(this);
            if (me.data("foundry.down")) {
                return canvasMouseFunc(me, e);
            }
        });
        canvas.fadeIn(function() {
            var me = $(this);
            var mySprite = thisSpriteSheet.sprites[me.data("foundry.index")];
            drawCanvas(me, mySprite);
        });
        canvas.center(true);
        canvas.draggable();

        return canvas;
    };

    var newSprite = function() {
        if (!thisSpriteSheet.sprites) {
            thisSpriteSheet.sprites = [];
        }

        var myIndex = thisSpriteSheet.sprites.length;

        var sprite = [];
        var y = thisSpriteSheet.rows;
        while (y > 0) {
            sprite.push(new Array(thisSpriteSheet.collumns));
            y--;
        }

        thisSpriteSheet.sprites.push(sprite);

        $("div.canvas div.board canvas").remove();

        createSpriteCanvas(myIndex);
        bindSideImage(sprite, myIndex);
        $("div.sidebar img.selected").removeClass("selected");
        $("div.sidebar img.item").eq(myIndex).addClass("selected");
        $("div.sidebar").scrollDown();
    };

    var bindSideImage = function(sprite, index) {
        var canvas = $("<canvas/>");
        canvas.attr("width", thisSpriteSheet.width);
        canvas.attr("height", thisSpriteSheet.height);

        canvas.width(thisSpriteSheet.width);
        canvas.height(thisSpriteSheet.height);

        drawCanvas(canvas, sprite, true);

        var img;
        if (!$("div.sidebar img.item").eq(index).length) {
            img = $("<img/>");
            img.appendTo(".sidebar");
            img.addClass("item");
            img.mouseover(function() {
                var me = $(this);
                var t = $("div.sidebar").scrollTop() + me.position().top + 5;
                $("div.sidebar div.options").css("top", t + "px");
                $("div.sidebar div.options").data("foundry.index", $(this).index(".item"));
                $("div.sidebar div.options").data("foundry.justnow", true);
                $("div.sidebar div.options").fadeIn();
            });
            img.mouseout(function() {
                $("div.sidebar div.options").data("foundry.justnow", false);

                setTimeout(function() {
                    if ($("div.sidebar div.options").data("foundry.justnow") || $("div.sidebar div.options").data("foundry.focus")) {
                        return false;
                    }
                    $("div.sidebar div.options").fadeOut();
                }, 500);
            });
            img.click(function() {
                $("div.sidebar img.selected").removeClass("selected");
                $(this).addClass("selected");
                var i = $(this).index(".item");
                var goon = function() {
                    var sprite = thisSpriteSheet.sprites[i];
                    var canvas = createSpriteCanvas(i);
                    drawCanvas(canvas, sprite);
                };

                if ($(".canvas .board canvas").length) {
                    $(".canvas .board canvas").fadeOut("fast", function() {
                        $(this).remove();
                        goon();
                    });
                } else {
                    goon();
                }
            });
        } else {
            img = $("div.sidebar img.item").eq(index);
        }
        img.attr("src", canvas[0].toDataURL());
    };

    spriteEditorBinds = function(spriteSheet) {
        spriteEditorHandlingBinds(spriteSheet, drawCanvas, bindSideImage);
        zoom = 0;
        thisSpriteSheet = spriteSheet;

        $("div.namecontainer").click(function() {
            foundry.inputDialog({
                message: "Enter the new name:",
                onconfirm: function(v) {
                    thisSpriteSheet.name = v;
                    $("div.namecontainer h3").text(v);
                }
            });
        });

        var colorSelectFunc = function() {
            $("div.canvas div.colors ul li.selected").removeClass("selected");
            $(this).addClass("selected");
            $("div.currentcolor").css("background-color",
                    $(this).data("foundry.color"));
            $("div.currentcolor").data("foundry.color", $(this).data("foundry.color"));
        };

        if (spriteSheet.colors) {
            for ( var i in spriteSheet.colors) {
                var c = spriteSheet.colors[i];
                var li = $("<li/>");
                li.css("background-color", c);
                li.data("foundry.color", c);
                li.click(colorSelectFunc);
                $(".canvas .colors ul").append(li);
            }
        }
        $(".canvas .colors ul li:first").click();

        $(".canvas .colors img").click(function() {
            foundry.colorPicker(function(c) {

                if (!thisSpriteSheet.colors) {
                    thisSpriteSheet.colors = [];
                }
                thisSpriteSheet.colors.push(c);

                var li = $("<li/>");
                $(".canvas .colors ul").append(li);
                li = $(".canvas .colors ul").children("li:last");

                li.css("background-color", c);
                li.data("foundry.color", c);
                li.click(colorSelectFunc);
                li.click();
            });
        });

        $("div.currentcolor").click(function() {
            var color = $(this).data("foundry.color");
            if (color) {
                var me = $(this);
                var li = $(".canvas .colors ul li.selected");
                var i = li.index();
                foundry.colorPicker(function(c) {
                    me.css("background-color", c);
                    me.data("foundry.color", c);

                    li.css("background-color", c);
                    li.data("foundry.color", c);

                    thisSpriteSheet.colors[i] = c;
                }, color);
            }
        });

        $(".canvas .board .toolbar img").click(function() {
            $(".canvas .board .toolbar img.selected").removeClass("selected");
            $(this).addClass("selected");
        });

        $("div.tollbar .saveButton").click(function() {
          var save = function() {
            var fs = require('fs');
            fs.writeFile(
              thisSpriteSheet.path,
              JSON.stringify(thisSpriteSheet),
              'utf8',
              function() {
              $("div.savedinfo").fadeIn("fast", function() {
                setTimeout(function() {
                        $("div.savedinfo").fadeOut();
                    },1500);
                });
            });
          };
          if (!thisSpriteSheet.path) {
            chooseFileForSave(function(path) {
              thisSpriteSheet.path = path;
              save();
            });
          } else {
            save();
          }
        });

        $("div.tollbar .newButton").click(newSprite);

        $("div.tollbar .copySpriteButton").click(function() {
            var c = $("div.canvas div.board canvas");
            if (c.length) {
                var sprite = thisSpriteSheet.sprites[c.data("foundry.index")];

                newSprite();

                c = $("div.canvas div.board canvas");
                var i = c.data("foundry.index");

                $("div.sidebar img.selected").removeClass("selected");

                var copied = thisSpriteSheet.sprites[i];
                for (var y in sprite) {
                    for (var x in sprite[y]) {
                        copied[y][x] = sprite[y][x];
                    }
                }

                sprite = thisSpriteSheet.sprites[i];
                drawCanvas(c, sprite);
                setTimeout(function() {
                    bindSideImage(sprite, i);
                    $("div.sidebar img.item").eq(i).addClass("selected");
                }, 1000);
            }
        });

        $("div.tollbar .exportSpriteButton").click(function() {
            if (thisSpriteSheet.sprites && thisSpriteSheet.sprites.length) {
                var v = thisSpriteSheet.spriteSheetColumns || 4;
                var div = $("<div> <div>How many collumns? <input class='value' type='text' value='" + v + "'/></div><input type='button' class='ok' value='Ok'/><input type='button' class='cancel' value='Cancel'/></div>");

                div.hide();
                div.appendTo("body");
                div.addClass("foundrydraggable");
                div.draggable();

                div.children("input.ok").click(function() {
                    var v = div.find("div input.value").val();
                    if (isNaN(parseInt(v))) {
                        div.shakeDialog(10, "left");
                        return false;
                    }
                    thisSpriteSheet.spriteSheetColumns = v;

                    div.fadeOut("fast", function() {
                        div.children("div,input").remove();

                        var img = $("<img/>");
                        img.appendTo(div);
                        img.spriteSheetImage(thisSpriteSheet, v);
                        div.fadeIn("fast", function() {
                            div.center();
                        });
                    });
                });

                div.children("input.cancel").click(function() {
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
            }
        });

        $("div.tollbar .animationSpriteButton").click(function() {
            if (thisSpriteSheet.sprites && thisSpriteSheet.sprites.length) {
                var v = thisSpriteSheet.fps || 4;
                var div = $("<div> <div>How many frames per second? <input class='value' type='text' value='" + v + "'/></div><input type='button' class='ok' value='Ok'/><input type='button' class='cancel' value='Cancel'/></div>");

                div.hide();
                div.appendTo("body");
                div.addClass("foundrydraggable");
                div.draggable();

                var canvas = $("<canvas/>");
                canvas.data("foundry.index", 0);
                canvas.data("foundry.playing", true);
                ajustCanvasBounds(canvas);

                div.children("input.ok").click(function() {
                    var v = div.find("div input.value").val();
                    if (isNaN(parseInt(v))) {
                        div.shakeDialog(10, "left");
                        return;
                    }
                    v = parseInt(v);
                    thisSpriteSheet.fps = v;

                    div.fadeOut("fast", function() {
                        div.children("div,input").remove();

                        div.append(canvas);
                        var time = 1000 / v;

                        var animate = function() {
                            if (canvas.data("foundry.playing")) {
                                var cellW = canvas.width() / thisSpriteSheet.collumns;
                                var cellH = canvas.height() / thisSpriteSheet.rows;


                                var i = canvas.data("foundry.index");

                                var next = (i + 1 < thisSpriteSheet.sprites.length ? i + 1 : 0);
                                canvas.data("foundry.index", next)
                                canvas.drawSprite( {
                                    sprite : thisSpriteSheet.sprites[i],
                                    cellW : cellW,
                                    cellH : cellH
                                });
                                setTimeout(animate, time);
                            }
                        };

                        div.fadeIn("fast", function() {
                            div.center();
                            animate();
                        });
                    });
                });

                div.children("input.cancel").click(function() {
                    canvas.data("foundry.playing", false);
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
            }
        });

        $(".righttoolbar input[type=checkbox]").click(function() {
            var c = $("div.canvas div.board canvas");
            if (c.length) {
                var sprite = thisSpriteSheet.sprites[c.data("foundry.index")];
                drawCanvas(c, sprite);
            }
        });

        var zoomFunc = function() {
            var c = $("div.canvas div.board canvas");
            if (c.length) {
                c.fadeOut("fast", function() {
                    ajustCanvasBounds(c);
                    var sprite = thisSpriteSheet.sprites[c.data("foundry.index")];
                    drawCanvas(c, sprite);
                    c.show();
                    c.center(true);
                });
            }
        };

        $("div.zoombar img").click(function() {
            if ($(this).is(".reset")) {
                zoom = 0;
            } else {
                var factor = $(this).is(".in") ? 1 : -1;
                zoom += 10 * factor;
            }
            $("div.zoombar span.zoom input").val(zoom);
            zoomFunc();
        });

        $("div.zoombar span.zoom input").keyup(function(e) {
            if (e.which == 13) {
                var n = parseInt($(this).val());
                if (isNaN(n)) {
                    $(this).val(zoom);
                } else {
                    zoom = n;
                    zoomFunc();
                }
            }
        })

        $("html").unbind("mousemove.foundryeditor");
        $("html").bind(
                "mousemove.foundryeditor",
                function() {
                    return $(".canvas .board .toolbar img.selected")
                            .is(".move")
                            || $("div.colorpicker").length != 0
                            || $(".foundrydraggable:visible").length != 0;
                });

        if (thisSpriteSheet.sprites) {
            for (var i in thisSpriteSheet.sprites) {
                bindSideImage(thisSpriteSheet.sprites[i], i)
            }
        }
        if ($("div.sidebar img.item").length) {
            $("div.sidebar img.item:first").click();
        }

        $("div.sidebar div.options").mouseover(function() {
            $(this).data("foundry.focus", true);
        });

        $("div.sidebar div.options").mouseout(function() {
            $(this).data("foundry.focus", false);
        });

        $("div.sidebar div.options img.up,div.sidebar div.options img.down").click(function() {
            var i = $("div.sidebar div.options").data("foundry.index");
            if (($(this).is(".up") && i > 0) || ($(this).is(".down") && i < thisSpriteSheet.sprites.length - 1)) {
                var other = 0;
                if ($(this).is(".up")) {
                    other = i - 1;
                } else {
                    other = i + 1;
                }

                var aux = thisSpriteSheet.sprites[other];
                thisSpriteSheet.sprites[other] = thisSpriteSheet.sprites[i];
                thisSpriteSheet.sprites[i] = aux;
                bindSideImage(thisSpriteSheet.sprites[other], other);
                bindSideImage(thisSpriteSheet.sprites[i], i);
                $("div.sidebar img.item").eq(other).click();
            }
        });

        $("div.sidebar div.options img.trash").click(function() {
            foundry.confirmDialog( {
                message : "Do you really want to delete this sprite?",
                onconfirm: function() {
                    var i = $("div.sidebar div.options").data("foundry.index");
                    $("div.sidebar img.item").eq(i).fadeOut("fast", function() {
                        $(this).remove();
                    });

                    $("div.board canvas").filter(function() {
                        return $(this).data("foundry.index") == i;
                    }).fadeOut("fast", function() {
                        if ($("div.sidebar img.item:last").length) {
                            $("div.sidebar img.item:last").click();
                        } else {
                            $(this).remove();
                        }
                    });
                    thisSpriteSheet.sprites.splice(i, 1);
                    $("div.sidebar div.options").fadeOut();
                }
            });
        });
    };
})(jQuery);