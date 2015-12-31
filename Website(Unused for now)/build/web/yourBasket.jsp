<%-- 
    Document   : yourBasket
    Created on : 25-Apr-2015, 22:10:59
    Author     : Mike
--%>

<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.text.DateFormat"%>
<%@page contentType="text/html" pageEncoding="UTF-8" import="BasketPackage.UserBean"%>
<%@ page errorPage="GeneralError.jsp" %>
<!DOCTYPE html>
<html>
    <%
        UserBean currentUser = (UserBean) (session.getAttribute("currentSessionUser"));
        String redirect = "";
    %>

    <jsp:useBean id="basket" scope="session" class="BasketPackage.CartBean" />

    <jsp:setProperty name="basket" property="*" />
    <%
        basket.processRequest(request);
    %>
    <head>

        <%
            if(currentUser == null) {
                currentUser = new UserBean();
                
                redirect = currentUser.redirect();
                System.out.println("User not logged in");
            }
            if(currentUser.getType() < 0 || currentUser.getType() > 1) {
                redirect = currentUser.redirect();
                System.out.println("User not logged in");
            }
            out.print(redirect);
                            %>
        <title>Your Basket</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="color: White; font-family: Arial, Helvetica, sans-serif; font-size: 10pt; background-color: Black;margin: 0; padding: 0; text-align: justify;">
        <!-- Title div -->
        <div style="width:760px; 
             margin-left:auto; 
             margin-right:auto;">
            <table>
                <tr>
                    <td style="overflow: hidden; width: 460px; text-align: left;">
                        <a href="home.jsp" style="font-weight: normal; letter-spacing: .005em; color: White; font-size: 24pt; text-align: Left;	text-decoration: none; ">
                            Disizza Shop
                        </a>
                    </td>
                    <td style="overflow: hidden; width: 300px; text-align: center;">
                        <%
                        String message = "You are not signed in.";
                        if (currentUser.getUsername() != null)
                            message = "You are logged in as " + currentUser.getUsername();
                            %>
                            <br><br>
                        <%= message%>
                    </td>
                    <td style="text-align: right;">
                        <%
                        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm");
                        %>
                        <%= dateFormat.format(new java.util.Date())%>
                    </td>
                </tr>
            </table>
        </div>

        <!-- actual content div -->
        <div style="width:760px; margin-left:auto; margin-right:auto; padding: 5px 0px 5px 0px;">
            <!-- Using a table to help with alignment. This has nothing to do with the project other than aesthetics -->
            <table>
                <tr>
                    <td style="overflow: hidden; width: 740px; text-align: left; padding: 10px;background-color: #363636;vertical-align: top;">
                        <p style="text-align:center;padding: 10px 0px 15px 0px; background-color: #000000; font-size: 16pt; margin-bottom: 7px; margin-top: 0;">
                            <i>Your Basket</i>
                        </p>

                        <p style="text-align:center;padding: 10px 5px 0px 5px; background-color: transparent; font-size: 12pt; margin-bottom: 0; margin-top: 0;">
                            You have the following Items in your basket
                        </p>
                        <!-- Actual project content starts here.-->
                        <ul style="padding: 5px 5px 5px 15px; border-bottom: 1px solid #484848; border-top: 1px solid #484848; background-color: #222222; text-align: left; font-size: 10pt;">
                            <%
                                String[] items = basket.getItems();
                                if(items.length < 1)
                                    out.print("<li style=\"text-align: center;\">You have no items in your basket</li>\n");
                                else {
                                for (int i = 0; i < items.length; i++) {
                                    out.print("<li> " + BasketPackage.HTMLFilter.filter(items[i]) + "</li>");
                                    }
                                }
                                %>
                        </ul>
                        <br>
                        <p style="font-size: 6pt;">
                            Note: You may only purchase one copy of each item.
                        </p>
                    </td>
                </tr>
            </table>
        </div>
    </body>
</html>