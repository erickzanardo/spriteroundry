package com.reddrummer.web.handler.desc;

import java.util.HashSet;
import java.util.Set;

import com.google.gson.JsonObject;
import com.googlecode.restitory.api.gae.JsonDesc;

public abstract class AbstractDescHandler extends JsonCallbackAdapter {

	@Override
	public void prePut(JsonObject json, JsonDesc desc) {
		desc.config(".*").can(false);
		Set<String> indexeds = getIndexeds();
		for (String key : indexeds) {
			desc.config(key).can(true).indexed(true);
		}
		Set<String> unindexeds = getUnindexeds();
		unindexeds.removeAll(indexeds);
		for (String key : unindexeds) {
			desc.config(key).can(true).indexed(false);
		}
	}

	protected Set<String> getUnindexeds() {
		HashSet<String> ret = new HashSet<String>();
		ret.add("_rev");
		return ret;
	}

	protected Set<String> getIndexeds() {
		HashSet<String> ret = new HashSet<String>();
		ret.add("_lastModified");
		return ret;
	}

}
