<%-- 
    Document   : makeErrors
    Created on : 18-Mar-2015, 08:40:22
    Author     : puser
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ page errorPage="GeneralError.jsp" %>
<!DOCTYPE html>
<html>
    <head>
        <title>Error creation page</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="color: White; 
          font-family: Arial, Helvetica, sans-serif; 
          font-size: 10pt; 
          background-color: Black;
          margin: 0; 
          padding: 0; 
          text-align: justify;">
              
        <!-- Title div -->
        <div style="width:760px; 
             margin-left:auto; 
             margin-right:auto;">
            <table>
                <tr>
                    <td style="overflow: hidden; width: 660px; text-align: left;">
                        <h1 style="font-weight: normal; 
                            letter-spacing: .005em; color: White;  
                            font-size: 24pt;
                            text-align: Left;">
                            The OWASP Nest
                        </h1>
                    </td>
                    <td style="text-align: right;">
                        Today's date: <%= (new java.util.Date()).toLocaleString()%>
                    </td>
                </tr>
            </table>
        </div>
            
        <!-- actual content div -->
        <div style="width:760px; 
             margin-left:auto; 
             margin-right:auto;
             padding: 5px 0px 5px 0px;">
            <!-- Using a table to help with alignment. This has nothing to do with the project other than aesthetics -->
            <table>
                <tr>
                    <td style="overflow: hidden; width: 740px; text-align: left; 
                        padding: 10px;background-color: #363636;vertical-align: top;">
                        <p style="text-align:center;padding: 10px 0px 15px 0px; background-color: #000000;
                           font-size: 16pt; margin-bottom: 7px; margin-top: 0;">
                            <i>Error Creation and Explanation Page</i>
                        </p>
                        <div style="padding: 5px 5px 5px 5px;
                            border-bottom: 1px solid #484848; 
                            border-top: 1px solid #484848; 
                            background-color: #222222; 
                            text-align: left;
                            font-size: 10pt;">
                            This page is for the creation of errors in order to display error pages.
                            <br> Please select an error below to throw the appropriate error and be 
                            brought to the appropriate error page.<br>
                            <ul>
                                <li>
                                    <a href="erherherhe" style="color: #76DEFC; text-decoration: none;">
                                        Error 404. (This will send a request to a nonexistent page)
                                    </a>
                                </li>
                                <li>
                                    <a href="Servlet00?dropElement=shadyWebsite" style="color: #76DEFC; text-decoration: none;">
                                        Error 405. (This will send a faulty request to a servlet)
                                    </a>
                                </li>
                                <li>
                                    <a href="createException.jsp" style="color: #76DEFC; text-decoration: none;">
                                        Error 500. (This will link to a page that will create an uncaught exception)
                                    </a>
                                </li>
                                <li>
                                    There are 
                                    <a href="Error403.jsp" style="color: #76DEFC; text-decoration: none;">
                                        Error 403(Permission)
                                    </a> catching capabilities, but I was unable to properly call this error. <br>
                                    Similarly for 401(Login) errors, I was unable to create the error.
                                </li>
                            </ul>
                            <br>
                            The POST servlet is Servlet00, which can be found on the initial page.<br>
                            The GET servlet is Servlet01 and can be found at the bottom of this page, and every OWASP page.<br>
                            (Servlet02 is also GET, but this used mostly for error samples)<br>
                            <br>
                            The JSP Expression element is at the top of the page. It is the current date.<br>
                            There is no JSP declaration element. I was not sure how to possibly implement this.
                        </div>
                        <div style="padding: 5px 10px 5px 10px;
                            border-bottom: 1px solid #484848; 
                            border-top: 1px solid #484848; 
                            background-color: #222222; 
                            text-align: left;
                            font-size: 10pt;">
                            <!-- Last Page visited: 
                            <br> <br> -->
                            <form action="Servlet01" method="get">
                                Select another page: 
                                <select name="dropElement">
                                    
                                    <option value="home">Home</option>
                                    <option value="owasp02">OWASP02 - Broken Authentication and Session Management</option>
                                    <option value="owasp03">OWASP03 - Cross-Site Scripting (XSS)</option>
                                    <option value="owasp04">OWASP04 - Insecure Direct Object References</option>
                                    <option value="owasp05">OWASP05 - Security Misconfiguration </option>
                                    <option value="owasp06">OWASP06 - Sensitive Data Exposure </option>
                                    <option value="owasp07">OWASP07 - Missing Function Level Access Control</option>
                                    <option value="owasp08">OWASP08 - Cross-Site Request Forgery </option>
                                    <option value="owasp09">OWASP09 - Using Components with Known Vulnerabilities</option>
                                    <option value="owasp10">OWASP10 - Unvalidated Redirects and Forwards</option>
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
