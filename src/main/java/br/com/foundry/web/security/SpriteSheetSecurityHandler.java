package br.com.foundry.web.security;

import java.util.Arrays;
import java.util.List;

import br.com.foundry.web.handler.PostLoadCallback;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.gson.JsonObject;
import com.googlecode.restitory.api.JsonService;
import com.googlecode.restitory.api.gae.JsonDesc;
import com.googlecode.restitory.api.servlet.JsonServiceFilter;

public class SpriteSheetSecurityHandler implements PostLoadCallback {

    @Override
    public List<String> getPaths() {
        return Arrays.asList("/r/spritesheet");
    }

    @Override
    public void prePut(JsonObject json, JsonDesc desc) {
        extracted(json);
    }

    @Override
    public void preDelete(String path) {
        JsonService service = JsonServiceFilter.get();
        JsonObject obj = service.get(path);

        extracted(obj);
    }

    private void extracted(JsonObject obj) {
        UserService userService = UserServiceFactory.getUserService();
        if (userService.isUserLoggedIn()) {
            String email = userService.getCurrentUser().getEmail();
            if (email != null) {
                if (email.equals(obj.get("user").getAsString())) {
                    return;
                }
            }
        }
        throw new FoundrySecurityException();
    }

    @Override
    public void postPut(JsonObject json) {
        extracted(json);
    }

    @Override
    public void postDelete(String path) {
    }

    @Override
    public void postLoad(JsonObject obj) {
        extracted(obj);
    }

    @Override
    public String preLoad(String id) {
        return id;
    }

    @Override
    public void preQuery(JsonObject query) {
    }
}
