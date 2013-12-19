package com.reddrummer.web.handler.desc;

import java.util.Arrays;
import java.util.List;
import java.util.Set;

public class SpriteSheetDescHandler extends AbstractDescHandler {

    @Override
    public List<String> getPaths() {
        return Arrays.asList("/r/spritesheet");
    }

    @Override
    protected Set<String> getIndexeds() {
        Set<String> indexeds = super.getIndexeds();
        indexeds.add("user");
        return indexeds;
    }

    @Override
    protected Set<String> getUnindexeds() {
        Set<String> unindexeds = super.getUnindexeds();
        unindexeds.addAll(Arrays.asList("width", "height", "collumns", "rows", "colors", "sprites", "name", "spriteSheetColumns", "fps"));
        return unindexeds;
    }
}
