/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Package00;

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
public class Servlet02 extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    public void doGet(HttpServletRequest request,
                    HttpServletResponse response)
            throws ServletException, IOException
  {
      PrintWriter out = response.getWriter();
      String xss = "";//for XSS example
      if(request.getParameter("input") != null) { //Will do nothing except in example
          xss = xssExample(xss);
      }
      out.print("<!DOCTYPE html>\n");
      out.print("<html>\n");
      out.print("    <head>\n");
      out.print(xss);
      out.print("        <title>OWASP flaw example</title>\n");
      out.print("        <meta charset=\"UTF-8\">\n");
      out.print("        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n");
      out.print("    </head>\n");
      out.print("<body style=\"color: White; font-family: Arial, Helvetica, sans-serif; font-size: 10pt; background-color: Black;margin: 0; padding: 0; text-align: justify;\">\n" +
"        <div style=\"width:760px; \n" +
"             margin-left:auto; \n" +
"             margin-right:auto;\">\n" +
"            <h1 style=\"	font-weight: normal; \n" +
"                letter-spacing: .005em; color: White;  \n" +
"                font-size: 24pt;\n" +
"                text-align: Left;\">\n" +
"                The OWASP Nest\n" +
"            </h1>\n" +
"        </div>\n" +
"            \n" +
"        <div style=\"width:760px; \n" +
"             margin-left:auto; \n" +
"             margin-right:auto;\n" +
"             padding: 5px 0px 5px 0px;\">\n" +
"            <table>\n" +
"                <tr>\n" +
"                    <td style=\"overflow: hidden; width: 740px; text-align: left; \n" +
"                        padding: 10px;background-color: #363636;vertical-align: top;\">\n" +
"                        <p style=\"text-align:center;padding: 10px 0px 15px 0px; background-color: #000000;\n" +
"                           font-size: 16pt; margin-bottom: 7px; margin-top: 0;\">\n" +
"                            <i>Broken Authentication and Session Management Example</i>\n" +
"                        </p>\n" +
"                        <p style=\"padding: 5px 5px 5px 5px;\n" +
"                            border-bottom: 1px solid #484848; \n" +
"                            border-top: 1px solid #484848; \n" +
"                            background-color: #222222; \n" +
"                            text-align: left;\n" +
"                            font-size: 10pt;\">\n" +
"                            If you look at the URL bar above you, you will be \n" +
"                            able to see \"username=");
      out.print(request.getParameter("username"));
      out.print("&password=");
      out.print(request.getParameter("password"));
      out.print("\" written there. <br>\n" +
"                            <br>\n" +
"                            This is a major security breach in the case that you \n" +
"                            would need to send this URL to anybody, or that anybody could\n" +
"                            check your web history. <br>\n" +
"                            <br>\n" +
"                            <a href=\"owasp02.jsp\" style=\"color: #76DEFC; text-decoration: none;\">\n" +
"                                Click here to go back to the OWASP02 page.\n" +
"                            </a>\n" +
"                        </p>\n" +
"                    </td>\n" +
"                </tr>\n" +
"            </table>\n" +
"        </div>\n" +
"    </body>");
      out.print("</html>");
  }

    private String xssExample(String page) {
        page = "<title>Happy Pretty Ponies!</title>\n" +
"        <meta charset=\"UTF-8\">\n" +
"        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
"    </head>\n" +
"        \n" +
"    <body style=\"color: White; font-family: Arial, Helvetica, sans-serif; font-size: 10pt; background-color: #FF69B4;margin: 0; padding: 0; text-align: justify;\">\n" +
"        <!-- Title div -->\n" +
"        <div style=\"width:760px; \n" +
"             margin-left:auto; \n" +
"             margin-right:auto;\">\n" +
"            <h1 style=\"	font-weight: normal; \n" +
"                letter-spacing: .005em; color: White;  \n" +
"                font-size: 24pt;\n" +
"                text-align: Left;\">\n" +
"                HAPPY PRETTY PONY FUN SITE!!!\n" +
"            </h1>\n" +
"        </div>\n" +
"        <div style=\"width:760px; \n" +
"             margin-left:auto; \n" +
"             margin-right:auto;\n" +
"             padding: 5px 0px 5px 0px;\">\n" +
"            <!-- The start of the pony site -->\n" +
"            <table>\n" +
"                <tr>\n" +
"                    <td style=\"overflow: hidden; width: 740px; text-align: left; \n" +
"                        padding: 10px;background-color: #EEAEEE;vertical-align: top;\">\n" +
"                        <p style=\"text-align:center;padding: 10px 0px 15px 0px; background-color: #FF69B4;\n" +
"                           font-size: 16pt; margin-bottom: 7px; margin-top: 0;\">\n" +
"                            <i>We love Happy and Pretty Ponies!</i>\n" +
"                        </p>\n" +
"                        <pre style=\"color:White;\n" +
"                            padding: 5px 0px 5px 0px;\n" +
"                            border-bottom: 1px solid #484848; \n" +
"                            border-top: 1px solid #484848; \n" +
"                            background-color: #FF00CC; \n" +
"                            text-align: left;\n" +
"                            font-size: 12pt;\">\n" +
"      ,  ,.~\"\"\"\"\"~~..\n" +
"      )\\,)\\`-,       `~._                                     .--._\n" +
"      \\  \\ | )           `~._                   .-\"\"\"\"\"-._   /     `.\n" +
"     _/ ('  ( _(\\            `~~,__________..-\"'          `-<        \\\n" +
"     )   )   `   )/)   )        \\                            \\,-.     |\n" +
"    ') /)`      \\` \\,-')/\\      (                             \\ /     |\n" +
"    (_(\\ /7      |.   /'  )'  _(`                              Y      |\n" +
"        \\       (  `.     ')_/`                                |      /\n" +
"         \\       \\   \\                                         |)    (\n" +
"          \\ _  /\\/   /                                         (      `~.\n" +
"           `-._)     |                                        / \\        `,\n" +
"                     |                          |           .'   )      (`\n" +
"                     \\                        _,\\          /     \\_    (`\n" +
"                      `.,      /       __..'7\"   \\         |       )  (\n" +
"                      .'     _/`-..--\"\"      `.   `.        \\      `._/\n" +
"                    .'    _.j     /            `-.  `.       \\\n" +
"                  .'   _.'   \\    |               `.  `.      \\\n" +
"                 |   .'       ;   ;               .'  .'`.     \\\n" +
"                 \\_  `.       |   \\             .'  .'   /    .'\n" +
"                   `.  `-, __ \\   /           .'  .'     |   (\n" +
"                     `.  `'` \\|  |           /  .-`     /   .'\n" +
"                       `-._.--t  ;          |_.-)      /  .'\n" +
"                              ; /           \\  /      / .'\n" +
"                             / /             `'     .' /\n" +
"                            /,_\\                  .',_(\n" +
"                           /___(                 /___(\n" +
"                        </pre>\n" +
"                        <!-- Actual project content starts here.-->\n" +
"                        <p style=\"padding: 5px 5px 5px 5px;\n" +
"                            border-bottom: 1px solid #FF69B4; \n" +
"                            border-top: 1px solid #FF69B4; \n" +
"                            background-color: #EE00EE; \n" +
"                            text-align: left;\n" +
"                            font-size: 10pt;\">\n" +
"                            \n" +
"                            This is an example of a page that has been altered to look differently through the use of XSS<br>\n" +
"                            <br>\n" +
"                            No. I don't know why I picked ponies. I guess they just seemed inoffensive and hilarious.<br>\n" +
"                            <br>\n" +
"                            <a href=\"owasp03.jsp\" style=\"color: #76DEFC; text-decoration: none;\">\n" +
"                                Click here to go back to the OWASP03 page.\n" +
"                            </a>\n" +
"                        </p>\n" +
"                    </td>\n" +
"                </tr>\n" +
"            </table>\n" +
"        </div>\n" +
"    </body>\n" +
"</html> <!-- this comment will remove the rest of the site.";
        return page;
    }
    
}
