package com.spritefoundry.web.security;

import static org.junit.Assert.assertEquals;

import java.io.UnsupportedEncodingException;

import javax.servlet.http.HttpServletResponse;

import org.junit.Test;

import com.google.gson.JsonObject;
import com.googlecode.restitory.gae.http.Request;
import com.googlecode.restitory.gae.http.Response;
import com.googlecode.restitory.gae.http.Type;
import com.spritefoundry.AbstractTestCase;

public class SpriteSheetSecurityHandlerTest extends AbstractTestCase {

    @Test
    public void testSpriteSheet() throws UnsupportedEncodingException {
        StringBuilder spritesheet = new StringBuilder();

        spritesheet.append("{width: 200, ");
        spritesheet.append("    height: 200, ");
        spritesheet.append("    collumns: 20, ");
        spritesheet.append("    rows: 20,");
        spritesheet.append("    colors: ['#000', '#e5e5e5'],");
        spritesheet.append("    sprites: [],");
        spritesheet.append("    user: 'test@example.com'}");

        Response resp = adapter.execute(new Request(Type.POST,
                "/r/spritesheet/").setContentType(
                "application/json;charset=UTF-8").setContent(
                spritesheet.toString().getBytes("UTF-8")));

        assertEquals(HttpServletResponse.SC_OK, resp.getCode());
        String id = resp.getContent().getJson().getAsString();

        resp = adapter.execute(new Request(Type.GET, id));
        JsonObject json = resp.getContent().getJson().getAsJsonObject();

        json.addProperty("width", 250);

        resp = adapter.execute(new Request(Type.PUT, id).setContentType(
                "application/json;charset=UTF-8").setContent(
                json.toString().getBytes("UTF-8")));
        assertEquals(HttpServletResponse.SC_OK, resp.getCode());

        resp = adapter.execute(new Request(Type.GET, id));
        json = resp.getContent().getJson().getAsJsonObject();

        assertEquals(250, json.get("width").getAsInt());

        spritesheet = new StringBuilder();

        spritesheet.append("{width: 200, ");
        spritesheet.append("    height: 200, ");
        spritesheet.append("    collumns: 20, ");
        spritesheet.append("    rows: 20,");
        spritesheet.append("    colors: ['#000', '#e5e5e5'],");
        spritesheet.append("    sprites: [],");
        spritesheet.append("    user: 'other@example.com'}");

        resp = adapter.execute(new Request(Type.POST, "/r/spritesheet/")
                .setContentType("application/json;charset=UTF-8").setContent(
                        spritesheet.toString().getBytes("UTF-8")));

        assertEquals(HttpServletResponse.SC_FORBIDDEN, resp.getCode());

        helper.getGaeHelper().setEnvEmail("other@example.com");

        resp = adapter.execute(new Request(Type.POST, "/r/spritesheet/")
                .setContentType("application/json;charset=UTF-8").setContent(
                        spritesheet.toString().getBytes("UTF-8")));

        assertEquals(HttpServletResponse.SC_OK, resp.getCode());

        resp = adapter.execute(new Request(Type.DELETE, id));
        assertEquals(HttpServletResponse.SC_FORBIDDEN, resp.getCode());

        resp = adapter.execute(new Request(Type.GET, id));
        assertEquals(HttpServletResponse.SC_FORBIDDEN, resp.getCode());
    }

}
