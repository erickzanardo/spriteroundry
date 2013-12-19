package br.com.foundry.web.handler;

import com.google.gson.JsonObject;
import com.googlecode.restitory.api.gae.JsonCallback;

public interface PostLoadCallback extends JsonCallback {

    public void postLoad(JsonObject obj);

    public String preLoad(String id);

    public void preQuery(JsonObject query);

}
