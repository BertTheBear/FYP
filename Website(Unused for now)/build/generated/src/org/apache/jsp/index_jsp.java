package org.apache.jsp;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class index_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent {

  private static final JspFactory _jspxFactory = JspFactory.getDefaultFactory();

  private static java.util.List<String> _jspx_dependants;

  private org.glassfish.jsp.api.ResourceInjector _jspx_resourceInjector;

  public java.util.List<String> getDependants() {
    return _jspx_dependants;
  }

  public void _jspService(HttpServletRequest request, HttpServletResponse response)
        throws java.io.IOException, ServletException {

    PageContext pageContext = null;
    HttpSession session = null;
    ServletContext application = null;
    ServletConfig config = null;
    JspWriter out = null;
    Object page = this;
    JspWriter _jspx_out = null;
    PageContext _jspx_page_context = null;

    try {
      response.setContentType("text/html;charset=UTF-8");
      pageContext = _jspxFactory.getPageContext(this, request, response,
      			null, true, 8192, true);
      _jspx_page_context = pageContext;
      application = pageContext.getServletContext();
      config = pageContext.getServletConfig();
      session = pageContext.getSession();
      out = pageContext.getOut();
      _jspx_out = out;
      _jspx_resourceInjector = (org.glassfish.jsp.api.ResourceInjector) application.getAttribute("com.sun.appserv.jsp.resource.injector");

      out.write("\n");
      out.write("\n");
      out.write("\n");
      out.write("<!DOCTYPE html>\n");
      out.write("<html>\n");
      out.write("    <head>\n");
      out.write("        <title>Home page</title>\n");
      out.write("        <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n");
      out.write("        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n");
      out.write("    </head>\n");
      out.write("    <body style=\"color: White; \n");
      out.write("          font-family: Arial, Helvetica, sans-serif; \n");
      out.write("          font-size: 10pt; \n");
      out.write("          background-color: Black;\n");
      out.write("          margin: 0; \n");
      out.write("          padding: 0; \n");
      out.write("          text-align: justify;\">\n");
      out.write("\n");
      out.write("        <!-- Title div -->\n");
      out.write("        <div style=\"width:760px; \n");
      out.write("             margin-left:auto; \n");
      out.write("             margin-right:auto;\">\n");
      out.write("            <table>\n");
      out.write("                <tr>\n");
      out.write("                    <td style=\"overflow: hidden; width: 660px; text-align: left;\">\n");
      out.write("                        <h1 style=\"font-weight: normal; \n");
      out.write("                            letter-spacing: .005em; color: White;  \n");
      out.write("                            font-size: 24pt;\n");
      out.write("                            text-align: Left;\">\n");
      out.write("                            Thisizza Shop\n");
      out.write("                        </h1>\n");
      out.write("                    </td>\n");
      out.write("                    <td style=\"text-align: right;\">\n");
      out.write("                        Today's date: ");
      out.print( (new java.util.Date()).toLocaleString());
      out.write("\n");
      out.write("                    </td>\n");
      out.write("                </tr>\n");
      out.write("            </table>\n");
      out.write("        </div>\n");
      out.write("\n");
      out.write("        <!-- actual content div -->\n");
      out.write("        <div style=\"width:760px; \n");
      out.write("             margin-left:auto; \n");
      out.write("             margin-right:auto;\n");
      out.write("             padding: 5px 0px 5px 0px;\">\n");
      out.write("            <!-- Using a table to help with alignment. This has nothing to do with the project other than aesthetics -->\n");
      out.write("            <table>\n");
      out.write("                <tr>\n");
      out.write("                    <td style=\"overflow: hidden; width: 740px; text-align: left; \n");
      out.write("                        padding: 10px;background-color: #363636;vertical-align: top;\">\n");
      out.write("                        <p style=\"text-align:center;padding: 10px 0px 15px 0px; background-color: #000000;\n");
      out.write("                           font-size: 16pt; margin-bottom: 7px; margin-top: 0;\">\n");
      out.write("                            <i>For testing parts</i>\n");
      out.write("                        </p>\n");
      out.write("\n");
      out.write("                        <p style=\"text-align:center;padding: 10px 5px 0px 5px; background-color: transparent;\n");
      out.write("                           font-size: 12pt; margin-bottom: 0; margin-top: 0;\">\n");
      out.write("                            Testing cart\n");
      out.write("                        </p>\n");
      out.write("                        <!-- Actual project content starts here.-->\n");
      out.write("                        <p style=\"padding: 5px 5px 5px 5px;\n");
      out.write("                           border-bottom: 1px solid #484848; \n");
      out.write("                           border-top: 1px solid #484848; \n");
      out.write("                           background-color: #222222; \n");
      out.write("                           text-align: left;\n");
      out.write("                           font-size: 10pt;\">\n");
      out.write("                        <form action=carts.jsp method=\"post\">\n");
      out.write("                            <BR>\n");
      out.write("                            Please enter item to add or remove:\n");
      out.write("                            <br>\n");
      out.write("                            Add Item:\n");
      out.write("\n");
      out.write("                            <SELECT NAME=\"item\">\n");
      out.write("                                <OPTION>Option 1\n");
      out.write("                                <OPTION>Option 2\n");
      out.write("                                <OPTION>Option 3\n");
      out.write("                                <OPTION>Option 4\n");
      out.write("                                <OPTION>Option 5\n");
      out.write("                                <OPTION>Option 6\n");
      out.write("                                <OPTION>Option 7\n");
      out.write("                            </SELECT>\n");
      out.write("\n");
      out.write("\n");
      out.write("                            <br> <br>\n");
      out.write("                            <INPUT TYPE=submit name=\"submit\" value=\"add\">\n");
      out.write("                            <INPUT TYPE=submit name=\"submit\" value=\"remove\">\n");
      out.write("\n");
      out.write("                        </form>\n");
      out.write("                        </p>\n");
      out.write("                        <p style=\"text-align:center;padding: 5px 5px 0px 5px; background-color: transparent;\n");
      out.write("                           font-size: 12pt; margin-bottom: 0; margin-top: 0;\">\n");
      out.write("                            Testing Login\n");
      out.write("                        </p>\n");
      out.write("                        <p style=\"padding: 5px 5px 5px 5px;\n");
      out.write("                           border-bottom: 1px solid #484848; \n");
      out.write("                           border-top: 1px solid #484848; \n");
      out.write("                           background-color: #222222; \n");
      out.write("                           text-align: left;\n");
      out.write("                           font-size: 10pt;\">\n");
      out.write("                        <form action=\"LoginServlet\" method=\"post\">\n");
      out.write("                            Username: &nbsp;<input type=\"text\" name=\"un\">\n");
      out.write("                            Password: &nbsp;<input type=\"password\" name=\"pw\" />\n");
      out.write("                            <input type=\"submit\" value=\"submit\">\t\t\t\n");
      out.write("\n");
      out.write("                        </form>\n");
      out.write("                        </p>\n");
      out.write("                    </td>\n");
      out.write("                </tr>\n");
      out.write("            </table>\n");
      out.write("        </div>\n");
      out.write("    </body>\n");
      out.write("</html>\n");
      out.write("<html>\n");
      out.write("    <head>\n");
      out.write("        <title>carts</title>\n");
      out.write("    </head>\n");
      out.write("\n");
      out.write("    <body bgcolor=\"white\">\n");
      out.write("\n");
      out.write("\n");
      out.write("\n");
      out.write("    </body>\n");
      out.write("</html>\n");
    } catch (Throwable t) {
      if (!(t instanceof SkipPageException)){
        out = _jspx_out;
        if (out != null && out.getBufferSize() != 0)
          out.clearBuffer();
        if (_jspx_page_context != null) _jspx_page_context.handlePageException(t);
        else throw new ServletException(t);
      }
    } finally {
      _jspxFactory.releasePageContext(_jspx_page_context);
    }
  }
}
