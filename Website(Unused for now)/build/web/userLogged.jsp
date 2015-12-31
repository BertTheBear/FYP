<%-- 
    Document   : userLogged
    Created on : 24-Apr-2015, 19:39:10
    Author     : Mike

http://met.guc.edu.eg/OnlineTutorials/JSP%20-%20Servlets/Full%20Login%20Example.aspx#
--%>

<%@ page language="java" 
         contentType="text/html; charset=windows-1256"
         pageEncoding="windows-1256"
         import="BasketPackage.UserBean"
         %>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" 
    "http://www.w3.org/TR/html4/loose.dtd">

<html>
<% 
    UserBean currentUser = (UserBean)(session.getAttribute("currentSessionUser"));
    String redirect = "";
%>
    <head>
        
        <%
            if(currentUser.getType() < 0 || currentUser.getType() > 1) {
                redirect = currentUser.redirect();
                System.out.println("User not logged in");
            }
            out.print(redirect);
                            %>
        
        <meta http-equiv="Content-Type" 
              content="text/html; charset=windows-1256">
        <title>   User Logged Successfully   </title>
    </head>

    <body>

        <center>
            

            Welcome <%= currentUser.getUsername()%>
        </center>

    </body>

</html>