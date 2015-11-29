/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package BasketPackage;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.UUID;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 *
 * @author Mike
 */
public class RegistrationServlet extends HttpServlet {

    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, java.io.IOException {
        doPost(req, res);
    }
    
    
        private String destination = "";

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(true);

        String username = HTMLFilter.filter(request.getParameter("username"));
        String password = HTMLFilter.filter(request.getParameter("password"));
        if (password.length() > 16 || username.length() > 16) {
            destination = "registrationFailure";
        } else {
            boolean go = true;
            char temp;
            for (int i = 0; i < username.length() && go; i++) {
                temp = username.charAt(i);
                if (temp < 48 || temp > 57) {
                    if (temp < 65 || temp > 90) {
                        if (temp < 97 || temp > 122) {
                            go = false;
                        }
                    }
                }
            }
            for (int i = 0; i < password.length() && go; i++) {
                temp = password.charAt(i);
                if (temp < 48 || temp > 57) {
                    if (temp < 65 || temp > 90) {
                        if (temp < 97 || temp > 122) {
                            go = false;
                        }
                    }
                }
            }

            if (go) {
                destination = "registrationSuccess";
                UserBean bean = new UserBean();
                String uuid = UUID.randomUUID().toString();
                uuid = uuid.substring(0, 8);
                bean.setUsername(username);
                bean.setPassword(password);
                bean.setType(1);
                bean.setID(uuid);

                addUser(bean);
                
                session.setAttribute("currentSessionUser", bean);
            } else {
                destination = "registrationFailure";
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

    private void addUser(UserBean bean) {
        String tableName = "toor.user_table";
        String format = "(id, username, password, type)";
        String update = "insert into " + tableName + format +
                "values ('" + bean.getID() + "','" + bean.getUsername() + 
                "','" + bean.getPassword() + "'," + bean.getType() + ")";
        
        ResultSet resultSet = null;
        Statement stmt = null;
        Connection con = null;
        
        try {
            con = ConnectionManager.getConnection();
            stmt = con.createStatement();
            int val = stmt.executeUpdate(update);
            
            System.out.print(val);


        }catch(Exception ex) {
            System.out.println(ex);
            destination = "registrationFailure";
        }
        finally {
            //close all of the connections
            if (resultSet != null) {
                try {
                    resultSet.close();
                } catch (Exception e) {
                    //Catch exception but no error message yet
                }
                resultSet = null;
            }

            if (stmt != null) {
                try {
                    stmt.close();
                } catch (Exception e) {
                    //Catch exception but no error message yet
                }
            }

            if (con != null) {
                try {
                    con.close();
                } catch (Exception e) {
                    //Catch exception but no error message yet
                }

                con = null;
            }
        }
    }
}
