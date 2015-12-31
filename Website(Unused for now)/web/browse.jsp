<%-- 
    Document   : browse
    Created on : 26-Apr-2015, 20:17:15
    Author     : Mike
--%>

<%@page import="BasketPackage.ConnectionManager"%>
<%@page import="java.sql.Connection"%>
<%@page import="java.sql.ResultSet"%>
<%@page import="java.sql.SQLException"%>
<%@page import="java.sql.Statement"%>
<%@page import="java.text.DateFormat"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page contentType="text/html" pageEncoding="UTF-8" import="BasketPackage.UserBean"%>
<%@ page errorPage="GeneralError.jsp" %>
<!DOCTYPE html>
<html>
    <%
        UserBean currentUser = (UserBean) (session.getAttribute("currentSessionUser"));
        String redirect = "";
    %>
    <head>

        <%
            if (currentUser == null) {
                currentUser = new UserBean();

                //redirect = currentUser.redirect();
                System.out.println("User not logged in");
            }/*
             if(currentUser.getType() < 0 || currentUser.getType() > 1) {
             redirect = currentUser.redirect();
             System.out.println("User not logged in");
             }*/

            out.print(redirect);
        %>
        <title>Browse Items</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="color: White; font-family: Arial, Helvetica, sans-serif; font-size: 10pt; background-color: Black; margin: 0; padding: 0; text-align: justify;">

        <!-- Title div -->
        <div style="width:760px; 
             margin-left:auto; 
             margin-right:auto;">
            <table>
                <tr>
                    <td style="overflow: hidden; width: 360px; text-align: left;">
                        <a href="home.jsp" style="font-weight: normal; letter-spacing: .005em; color: White; font-size: 24pt; text-align: Left;	text-decoration: none; ">
                            Disizza Shop
                        </a>
                    </td>
                    <td style="overflow: hidden; width: 300px; text-align: center;">
                        <%
                            String message = "You are not signed in.";
                            if (currentUser.getUsername() != null) {
                                message = "You are logged in as " + currentUser.getUsername();
                            }
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
                            <i>Browse Items</i>
                        </p>

                        <p style="text-align:center;padding: 10px 5px 0px 5px; background-color: transparent; font-size: 12pt; margin-bottom: 0; margin-top: 0;">
                            All items
                        </p>
                        <!-- Actual project content starts here.-->

                            <table style="padding: 5px 5px 5px 5px; border-bottom: 1px solid #484848; border-top: 1px solid #484848; background-color: #222222; text-align: left; font-size: 10pt;">
                                <tr>
                                    <td style="width: 45px;"><b>ID</b></td>
                                    <td style="width: 200px;"><b>Name</b></td>
                                    <td style="width: 450px; overflow: hidden;"><b>Description</b></td>
                                    <td style="text-align: right;"><b>Price</b></td>
                                    <td style="width: 30px;"><b>Stock</b></td>
                                </tr>
                                <%
                                    try {
                                        String query = "select * from toor.item_table";
                                        Connection conn = ConnectionManager.getConnection();
                                        Statement stmt = conn.createStatement();
                                        ResultSet rs = stmt.executeQuery(query);
                                        while (rs.next()) {

                                %>
                                <tr><td style="font-size: 8pt;"><%= rs.getString("ID") %></td>
                                    <td>
                                        <i><%= rs.getString("name") %></i>
                                    </td>
                                    <td style="font-size: 9pt;"> <%= rs.getString("description") %></td>
                                    <td style="text-align: right;"><%= rs.getDouble("price") %></td>
                                    <td style="text-align: right;"> <%= rs.getInt("stock") %> </td>
                                </tr>
                                    <%

                                        }
                                    %>
                            </table>
                            <%
                                    rs.close();
                                    stmt.close();
                                    conn.close();
                                } catch (Exception e) {
                                    e.printStackTrace();
                                }


                            %>
                        <div>
                            <form action="PageServlet" method="get" 
                                  style="padding: 5px 10px 5px 10px; border-bottom: 1px solid #484848; border-top: 1px solid #484848; background-color: #222222; text-align: center; font-size: 10pt;">
                                Select another page: 
                                <select name="element">
                                    <option value="home">Home</option>
                                    <option value="1">Log in to your account</option>
                                    <option value="2">Search for an item</option>
                                    <option value="3">Browse all items</option>
                                    <option value="4">View your basket</option>
                                    <option value="5">Proceed to check-out</option>
                                    <option value="6">Log out of your account</option>
                                </select>
                                <input type="submit" value="Submit" style="width:125px;">
                            </form>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    </body>
</html>