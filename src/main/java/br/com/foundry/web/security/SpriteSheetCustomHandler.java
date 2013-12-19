package br.com.foundry.web.security;

import br.com.foundry.web.handler.CustomHandler;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

public class SpriteSheetCustomHandler extends CustomHandler {

    @Override
    public void beforePut(JsonObject obj) {
        if (!obj.get("sprites").isJsonPrimitive()) {
            JsonArray asJsonArray = obj.get("sprites").getAsJsonArray();
            obj.addProperty("sprites", asJsonArray.toString());
        }
    }

}
