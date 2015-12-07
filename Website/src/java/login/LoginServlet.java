
package login;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 *
 * @author Mike
 * http://met.guc.edu.eg/OnlineTutorials/JSP%20-%20Servlets/Full%20Login%20Example.aspx#
 */
public class LoginServlet extends HttpServlet {

    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, java.io.IOException {
        doPost(req, res);
    }

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        HttpSession session = request.getSession(true);
        UserBean user = new UserBean();
        String destination = "";
        
        if(request.getParameter("logout") != null) {
            user.logout();
            destination = "loggedout";
            session.setAttribute("currentSessionUser", user);
        }
        else {
            try {
                user.setUsername(request.getParameter("username"));
                user.setPassword(request.getParameter("password"));

                user = UserDAO.login(user);

                if (user.isValid()) {
                    session.setAttribute("currentSessionUser", user);
                    destination = "home"; //logged-in page      		
                } else {
                    destination = "invalidLogin"; //error page 
                }
            } catch (Exception ex) {
                //Throws default error
                System.out.println(ex);
            }
        }
        
        PrintWriter out = response.getWriter();
        out.print("<!DOCTYPE html>\n");
        out.print("<html>\n");
        out.print("    <head>\n");
        out.print("        <meta http-equiv=\"refresh\" content=\"0; url=");
        out.print(destination);
        out.print(".jsp\" />\n");
        out.print("        <title>Redirecting</title>\n");
        out.print("        <meta charset=\"UTF-8\">\n");
        out.print("        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n");
        out.print("    </head>\n");
        out.print("<body style=\"color: White; font-family: Arial, Helvetica, sans-serif; font-size: 10pt; background-color: Black;margin: 0; padding: 0; text-align: justify;\">\n");
        out.print("<div>\n");
        out.print("<h1 style=\"	font-weight: normal; letter-spacing: .005em; color: White;  font-size: 10pt;text-align: Left;\">\n");
        out.print("Redirecting... <br>\n");
        out.print("Please wait...\n");
        out.print("</h1>\n");
        out.print("</div>\n");
        out.print("\n");
        out.print("</body>");
        out.print("</html>");
    }
}
