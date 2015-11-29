/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package BasketPackage;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author Mike
 */
public class PageServlet extends HttpServlet {

    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {
        String destination;
        String selection = req.getParameter("element");
        selection = HTMLFilter.filter(selection);
        try {
            switch(selection) {
                case "1":
                    destination = "login";
                    break;
                case "2":
                    destination = "search";
                    break;
                case "3":
                    destination = "browse";
                    break;
                case "4":
                    destination = "yourBasket";
                    break;
                case "5":
                    destination = "checkout";
                    break;
                case "6":
                    destination = "logout";
                    break;
                case "login.jsp":
                    destination = "login";
                    break;
                case "search.jsp":
                    destination = "search";
                    break;
                case "browse.jsp":
                    destination = "browse";
                    break;
                case "yourBasket.jsp":
                    destination = "yourBasket";
                    break;
                case "checkout.jsp":
                    destination = "checkout";
                    break;
                case "logout.jsp":
                    destination = "logout";
                    break;
                default:
                    destination = "home";
            }
        }catch(Exception ex) {
            destination = "home";
            System.out.println("Error redirecting from home.");
            System.out.println(ex);
        }
        PrintWriter out = res.getWriter();
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

    @Override
    public void doPost(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {
        doGet(req, res);
    }
}
