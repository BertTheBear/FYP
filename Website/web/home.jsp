<%-- 
    Document   : home
    Created on : 25-Apr-2015, 23:54:43
    Author     : Mike
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ page errorPage="GeneralError.jsp" %>
<!DOCTYPE html>
<html>
    <head>
        <title>Chill Home Page</title>
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
                        <h1 style="font-weight: normal; letter-spacing: .005em; color: White; font-size: 24pt; text-align: Left;">
                            Disizza Shop
                        </h1>
                    </td>
                    <td style="text-align: right;">
                        Today's date: <%= (new java.util.Date()).toLocaleString()%>
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
                            <i>Welcome to Disizza</i>
                        </p>

                        <p style="text-align:center;padding: 10px 5px 0px 5px; background-color: transparent; font-size: 12pt; margin-bottom: 0; margin-top: 0;">
                            Please select an option below:
                        </p>
                        <!-- Actual project content starts here.-->
                        <form action="PageServlet" method="get" 
                            style="padding: 5px 0px 5px 0px; border-bottom: 1px solid #484848; border-top: 1px solid #484848; background-color: #222222; text-align: left; font-size: 12pt;">
                                <input type="radio" name="element" value="login.jsp" checked>
                                Log in to your account<br>
                                <input type="radio" name="element" value="search.jsp">
                                Search for an item <br>
                                <input type="radio" name="element" value="browse.jsp">
                                Browse all items <br>
                                <input type="radio" name="element" value="yourBasket.jsp">
                                View your basket <br>
                                <input type="radio" name="element" value="checkout.jsp">
                                Proceed to check-out <br>
                                <input type="radio" name="element" value="logout.jsp">
                                Log out of your account<br>
                                <br>
                                <div style="width:125px; margin-left:auto; margin-right:auto;">
                                    <input type="submit" value="Select" style="width:125px;">
                                </div>
                        </form>
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