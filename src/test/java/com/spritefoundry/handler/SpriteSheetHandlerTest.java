package com.spritefoundry.handler;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.io.UnsupportedEncodingException;

import javax.servlet.http.HttpServletResponse;

import org.junit.Test;

import com.google.gson.JsonObject;
import com.googlecode.restitory.gae.http.Request;
import com.googlecode.restitory.gae.http.Response;
import com.googlecode.restitory.gae.http.Type;
import com.spritefoundry.AbstractTestCase;

public class SpriteSheetHandlerTest extends AbstractTestCase {

    @Test
    public void testSpriteSheet() throws UnsupportedEncodingException {
        StringBuilder spritesheet = new StringBuilder();

        spritesheet.append("{width: 200, ");
        spritesheet.append("    height: 200, ");
        spritesheet.append("    collumns: 20, ");
        spritesheet.append("    rows: 20,");
        spritesheet.append("    colors: ['#000', '#e5e5e5'],");
        spritesheet
                .append("    sprites: [['#000', '#000'], ['#000', '#000']],");
        spritesheet.append("    user: 'test@example.com'}");

        Response resp = adapter.execute(new Request(Type.POST,
                "/r/spritesheet/").setContentType(
                "application/json;charset=UTF-8").setContent(
                spritesheet.toString().getBytes("UTF-8")));

        assertEquals(HttpServletResponse.SC_OK, resp.getCode());
        String id = resp.getContent().getJson().getAsString();

        resp = adapter.execute(new Request(Type.GET, id));
        JsonObject json = resp.getContent().getJson().getAsJsonObject();
        assertTrue(json.get("sprites").isJsonArray());
    }
}
