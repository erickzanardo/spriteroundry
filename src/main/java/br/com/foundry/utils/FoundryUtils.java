package br.com.foundry.utils;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;

public class FoundryUtils {
    public static JsonArray field(JsonArray array, String attribute) {
        JsonArray ret = new JsonArray();
        for (JsonElement element : array) {
            ret.add(element.getAsJsonObject().get(attribute));
        }
        return ret;
    }
}
