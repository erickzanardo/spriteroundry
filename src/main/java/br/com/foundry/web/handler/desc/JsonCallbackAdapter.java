package br.com.foundry.web.handler.desc;


import br.com.foundry.web.handler.PostLoadCallback;

import com.google.gson.JsonObject;
import com.googlecode.restitory.api.gae.AbstractJsonCallback;

public abstract class JsonCallbackAdapter extends AbstractJsonCallback
		implements PostLoadCallback {

	@Override
	public void postLoad(JsonObject obj) {
	}

	@Override
	public String preLoad(String id) {
		return id;
	}

	@Override
	public void preQuery(JsonObject query) {

	}

}
