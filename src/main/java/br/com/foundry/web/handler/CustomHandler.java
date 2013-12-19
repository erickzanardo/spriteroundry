package br.com.foundry.web.handler;

import com.google.gson.JsonObject;

public abstract class CustomHandler {
    public abstract void beforePut(JsonObject obj);
}
