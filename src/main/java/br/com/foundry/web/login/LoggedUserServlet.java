package br.com.foundry.web.login;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.gson.JsonObject;

public class LoggedUserServlet extends HttpServlet {
    private static final long serialVersionUID = -2400416550669386919L;

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        UserService service = UserServiceFactory.getUserService();

        if (service.isUserLoggedIn()) {
            User currentUser = service.getCurrentUser();

            JsonObject user = new JsonObject();

            user.addProperty("email", currentUser.getEmail());

            String name = currentUser.getNickname() != null
                    && !"".equals(currentUser.getNickname()) ? currentUser
                    .getNickname() : currentUser.getEmail();
            user.addProperty("name", name);

            resp.setContentType("application/json;charset=UTF-8");
            resp.getOutputStream().write(user.toString().getBytes("UTF-8"));
        } else {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }
    }
}
