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
public class Servlet01 extends HttpServlet {

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
      String page = request.getParameter("dropElement");
      if(page.matches("home"))
          page = "index.html";
      else
          page += ".jsp";
      PrintWriter out = response.getWriter();
      out.print("<!DOCTYPE html>\n");
      out.print("<html>\n");
      out.print("    <head>\n");
      out.print("        <meta http-equiv=\"refresh\" content=\"0; url=");
      out.print(page);
      out.print("\" />\n");
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
