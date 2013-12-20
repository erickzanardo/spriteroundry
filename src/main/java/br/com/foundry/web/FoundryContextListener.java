package br.com.foundry.web;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import br.com.foundry.web.handler.SpriteSheetHandler;
import br.com.foundry.web.handler.desc.SpriteSheetDescHandler;
import br.com.foundry.web.security.SpriteSheetSecurityHandler;

import com.googlecode.restitory.api.gae.JsonCallbackHandler;

public class FoundryContextListener implements ServletContextListener {

    private static JsonCallbackHandler handler;

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        if (handler == null) {
            handler = JsonCallbackHandler.instance();

            handler.add(new SpriteSheetSecurityHandler());
            handler.add(new SpriteSheetHandler());
            handler.add(new SpriteSheetDescHandler());
        }
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
    }
}
