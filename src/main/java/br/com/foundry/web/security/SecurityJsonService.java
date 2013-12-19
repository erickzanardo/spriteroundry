package br.com.foundry.web.security;

import java.util.ArrayList;
import java.util.List;

import br.com.foundry.utils.FoundryUtils;
import br.com.foundry.web.handler.PostLoadCallback;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.googlecode.restitory.api.JsonHelper;
import com.googlecode.restitory.api.QueryType;
import com.googlecode.restitory.api.gae.JsonCallback;
import com.googlecode.restitory.api.gae.JsonCallbackHandler;
import com.googlecode.restitory.api.gae.TxJsonServiceAdapter;
import com.googlecode.restitory.gae.filter.util.JsonUtil;

public class SecurityJsonService extends TxJsonServiceAdapter {

    public SecurityJsonService() {
        super(new CustomJsonService());
    }

    private String preLoad(String id) {
        if (id != null) {
            List<JsonCallback> list = JsonCallbackHandler.instance().get(id);
            for (JsonCallback callback : list) {
                if (callback instanceof PostLoadCallback) {
                    id = ((PostLoadCallback) callback).preLoad(id);
                }
            }
        }
        return id;
    }

    private Iterable<String> preLoad(Iterable<String> paths) {
        List<String> ret = new ArrayList<String>();
        for (String element : paths) {
            ret.add(preLoad(element));
        }
        return ret;
    }

    private JsonObject preQuery(JsonObject query) {
        if (query != null) {
            String kind = query.get("kind").getAsString();
            List<JsonCallback> list = JsonCallbackHandler.instance().get(kind);
            for (JsonCallback callback : list) {
                if (callback instanceof PostLoadCallback) {
                    ((PostLoadCallback) callback).preQuery(query);
                }
            }
        }
        return query;
    }

    private JsonArray postLoad(JsonArray query) {
        JsonArray ret = new JsonArray();
        for (JsonElement element : query) {
            ret.add(postLoad(element.getAsJsonObject()));
        }
        return ret;
    }

    private JsonArray postLoad(JsonArray query, Number limit) {
        JsonArray ret = new JsonArray();
        for (JsonElement element : query) {
            if (ret.size() >= limit.intValue()) {
                break;
            }
            try {
                JsonObject postLoad = postLoad(element.getAsJsonObject());
                ret.add(postLoad);
            } catch (FoundrySecurityException e) {

            }
        }
        return ret;
    }

    private JsonObject postLoad(JsonObject obj) {
        if (obj != null) {
            String path = (String) JsonUtil.getJsonValue(obj.get("_self"));
            List<JsonCallback> list = JsonCallbackHandler.instance().get(path);
            for (JsonCallback callback : list) {
                if (callback instanceof PostLoadCallback) {
                    ((PostLoadCallback) callback).postLoad(obj);
                }
            }
        }
        return obj;
    }

    @Override
    public JsonObject get(String id) {
        id = preLoad(id);
        return postLoad(super.get(id));
    }

    @Override
    public JsonArray getAll(Iterable<String> paths) {
        paths = preLoad(paths);
        return postLoad(super.getAll(paths));
    }

    @Override
    public JsonObject cursor(JsonObject query) {
        query = preQuery(query);

        QueryType type = JsonHelper.jsonToEnum(QueryType.class,
                query.get("type"), QueryType.PATH);
        if (type.equals(QueryType.DELETE)) {
            return super.cursor(query);
        }
        String attribute = (String) JsonUtil.value(query.get("attribute"));
        if (type.equals(QueryType.PATH)) {
            query.addProperty("type", "json");
        }
        query.remove("attribute");

        JsonObject ret = super.cursor(query);
        JsonArray array = ret.get("result").getAsJsonArray();

        if (type.equals(QueryType.PATH)) {
            array = FoundryUtils.field(array, "_self");
            query.addProperty("type", type.name());
        }
        if (attribute != null) {
            array = FoundryUtils.field(array, attribute);
            query.addProperty("attribute", attribute);
        }

        ret.add("result", postLoad(array));

        return ret;
    }

    @Override
    public JsonArray query(JsonObject query) {
        query = preQuery(query);
        QueryType type = JsonHelper.jsonToEnum(QueryType.class,
                query.get("type"), QueryType.PATH);
        if (type.equals(QueryType.DELETE)) {
            return super.query(query);
        }
        String attribute = (String) JsonUtil.value(query.get("attribute"));
        if (type.equals(QueryType.PATH)) {
            query.addProperty("type", "json");
        }
        query.remove("attribute");
        Number access = (Number) JsonUtil.value(query.get("access"));
        Number limit = (Number) JsonUtil.value(query.get("l"));
        if (access != null) {
            query.addProperty("l", access.longValue());
        }

        JsonArray result = super.query(query);

        JsonArray array = null;
        if (access == null) {
            array = postLoad(result);
        } else {
            array = postLoad(result, limit);
        }

        if (type.equals(QueryType.PATH)) {
            array = FoundryUtils.field(array, "_self");
            query.addProperty("type", type.name());
        }
        if (attribute != null) {
            array = FoundryUtils.field(array, attribute);
            query.addProperty("attribute", attribute);
        }
        if (limit != null) {
            query.addProperty("l", limit.intValue());
        }

        return array;
    }
}
