package br.com.foundry.web;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import br.com.foundry.web.security.FoundrySecurityException;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

public class SecurityFilter implements Filter {

    private List<String> urls;

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        JsonParser parser = new JsonParser();
        JsonElement parse = parser.parse(filterConfig
                .getInitParameter("permittedUrls"));
        if (parse == null || !parse.isJsonArray()) {
            throw new RuntimeException(" Permitted must be a json.");
        }

        JsonArray array = parse.getAsJsonArray();
        urls = new ArrayList<String>();
        for (JsonElement jsonElement : array) {
            urls.add(jsonElement.getAsString());
        }
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response,
            FilterChain chain) throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse resp = (HttpServletResponse) response;

        String path = req.getRequestURI();

        if (path.startsWith("/r/")) {
            if (countStr(path, "/") > 2) {
                path = path.substring(0, path.lastIndexOf("/"));
            }

            if (!urls.contains(path)) {
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                return;
            }
        }

        try {
            chain.doFilter(request, response);
        } catch (FoundrySecurityException e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_FORBIDDEN);
        }
    }

    @Override
    public void destroy() {
    }

    private int countStr(String str, String s) {
        int r = 0;
        while(str.contains(s)) {
            str = str.replaceFirst(s, "");
            r++;
        }
        return r;
    }
}
