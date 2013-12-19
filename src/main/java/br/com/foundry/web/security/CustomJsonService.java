package br.com.foundry.web.security;

import java.util.HashMap;
import java.util.Map;

import br.com.foundry.web.handler.CustomHandler;

import com.google.gson.JsonObject;
import com.googlecode.restitory.api.gae.DatastoreJsonService;

public class CustomJsonService extends DatastoreJsonService {
    private static Map<String, CustomHandler> customHandlers = new HashMap<String, CustomHandler>();
    static {
        customHandlers.put("/r/spritesheet", new SpriteSheetCustomHandler());
    }

    @Override
    public String put(JsonObject obj) {
        verifyHandler(obj);
        return super.put(obj);
    }

    @Override
    public String post(JsonObject obj) {
        verifyHandler(obj);
        return super.post(obj);
    }

    private void verifyHandler(JsonObject obj) {
        String self = obj.get("_self").getAsString();
        for (String path : customHandlers.keySet()) {
            if (self.startsWith(path)) {
                customHandlers.get(path).beforePut(obj);
            }
        }
    }
}
