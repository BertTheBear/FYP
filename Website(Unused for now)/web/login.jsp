<%-- 
    Document   : invalidLogin
    Created on : 24-Apr-2015, 19:52:14
    Author     : Mike
--%>

<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.text.DateFormat"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ page errorPage="GeneralError.jsp" %>
<!DOCTYPE html>
<html>
    <head>
        <title>Sign in</title>
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
                    <td style="overflow: hidden; width: 660px; text-align: left;">
                        <a href="home.jsp" style="font-weight: normal; letter-spacing: .005em; color: White; font-size: 24pt; text-align: Left;	text-decoration: none; ">
                            Disizza Shop
                        </a>
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
                            <i>Please Log In</i>
                        </p>

                        <p style="text-align:center;padding: 10px 5px 3px 5px; background-color: transparent; font-size: 12pt; margin-bottom: 0; margin-top: 0;">
                            You need to Sign in before using this site.
                        </p>
                        <!-- Actual project content starts here.-->
                        <div style="padding: 10px 5px 5px 5px; border-bottom: 1px solid #484848; border-top: 1px solid #484848; background-color: #222222; font-size: 10pt;">
                            <table> <tr> <td style="overflow: hidden; width: 350px; text-align: right;">
                                        Username: &nbsp; <br> <br>
                                        Password: &nbsp; <br>
                                    <br> <br> <br>
                                </td> 
                                <td style="overflow: hidden; width: 350px; text-align: left;">
                                    <form action="LoginServlet" method="post">
                                        <input type="text" name="username"> <br> <br>
                                        <input type="password" name="password" /> <br> <br>
                                        <input type="submit" value="submit">			
                                    </form>
                            </td></tr></table>
                            
                            <a href="registerUser.jsp" style="color: #76DEFC; text-decoration: none;">Register new user</a>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    </body>
</html>