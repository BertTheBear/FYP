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

public class Servlet00 extends HttpServlet{
    
    @Override
    public void doPost(HttpServletRequest req,
                    HttpServletResponse res)
            throws ServletException, IOException
  {
      PrintWriter out = res.getWriter();
      out.print("<!DOCTYPE html>\n");
      out.print("<html>\n");
      out.print("    <head>\n");
      out.print("        <meta http-equiv=\"refresh\" content=\"0; url=owasp");
      out.print(req.getParameter("element"));
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
