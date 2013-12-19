package br.com.foundry.web.handler;

import java.util.Arrays;
import java.util.List;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.googlecode.restitory.api.gae.JsonDesc;

public class SpriteSheetHandler implements PostLoadCallback {

    @Override
    public List<String> getPaths() {
        return Arrays.asList("/r/spritesheet");
    }

    @Override
    public void prePut(JsonObject json, JsonDesc desc) {
    }

    @Override
    public void preDelete(String path) {
    }

    @Override
    public void postPut(JsonObject json) {
    }

    @Override
    public void postDelete(String path) {
    }

    @Override
    public void postLoad(JsonObject obj) {
        if (obj.get("sprites") != null && !obj.get("sprites").isJsonNull()) {
            String sprites = obj.get("sprites").getAsString();
            JsonParser parser = new JsonParser();
            JsonElement parse = parser.parse(sprites);
            obj.add("sprites", parse.getAsJsonArray());
        }
    }

    @Override
    public String preLoad(String id) {
        return id;
    }

    @Override
    public void preQuery(JsonObject query) {
    }
}
