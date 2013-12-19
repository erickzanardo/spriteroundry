package br.com.foundry.web.login;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;

public class LogOutServlet extends HttpServlet {
    private static final long serialVersionUID = -2400416550669386919L;

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        UserService service = UserServiceFactory.getUserService();

        resp.sendRedirect(service.createLogoutURL("#index"));
    }
}
