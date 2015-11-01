<%-- 
    Document   : owasp08
    Created on : 11-Mar-2015, 20:37:10
    Author     : Mike
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ page errorPage="GeneralError.jsp" %>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>08 - Cross-Site Request Forgery</title>
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
                            <i>OWASP Element 08: Cross-Site Request Forgery</i>
                        </p>
                        <!-- Actual project content starts here.-->
                        <p style="text-align:center;padding: 10px 5px 0px 5px; background-color: transparent;
                           font-size: 12pt; margin-bottom: 0; margin-top: 0;">
                            General Description
                        </p>
                        <!-- Actual project content starts here.-->
                        <p style="padding: 5px 5px 5px 5px;
                            border-bottom: 1px solid #484848; 
                            border-top: 1px solid #484848; 
                            background-color: #222222; 
                            text-align: left;
                            font-size: 10pt;">
                            Because browsers usually send certain credentials such as session cookies
                            automatically, it is possible to create malicious web pages which will generate forged
                            requests that can be indistinguishable from legitimate ones.<br>
                            This means that these websites can "steal" these cookies and sessions and use them 
                            to impersonate the user.<br>
                            This is easily detected by penetration testing and code analysis.
                        </p>
                        <p style="text-align:center;padding: 5px 5px 0px 5px; background-color: transparent;
                           font-size: 12pt; margin-bottom: 0; margin-top: 0;">
                            Typical Impact
                        </p>
                        <p style="padding: 5px 5px 5px 5px;
                            border-bottom: 1px solid #484848; 
                            border-top: 1px solid #484848; 
                            background-color: #222222; 
                            text-align: left;
                            font-size: 10pt;">
                            Attackers can trick the victims into performing state changing operations that 
                            the victim is authorised to do. This means that these attackers can make purchases
                            with this account, logout, and even log back in.
                        </p>
                        <p style="text-align:center;padding: 5px 5px 0px 5px; background-color: transparent;
                           font-size: 12pt; margin-bottom: 0; margin-top: 0;">
                            Typical Impact Scenario
                        </p>
                        <p style="padding: 5px 5px 5px 5px;
                            border-bottom: 1px solid #484848; 
                            border-top: 1px solid #484848; 
                            background-color: #222222; 
                            text-align: left;
                            font-size: 10pt;">
                            The attacker constructs a request that will perform some action through the victim's account and embeds this
                            in an image request or other request stored on any site under the attacker's control.<br>
                            If the victim visits any of these sites and makes any of these requests, while authenticated
                            with the chosen other site(Online banking for example), then the forged requests will 
                            gather this necessary authentication and be able to execute any commands the user is able to, such as 
                            transfer of money, or purchase of items.
                        </p>
                        <p style="text-align:center;padding: 5px 5px 0px 5px; background-color: transparent;
                           font-size: 12pt; margin-bottom: 0; margin-top: 0;">
                            Methods to avoid this weakness
                        </p>
                        <p style="padding: 5px 5px 5px 5px;
                            border-bottom: 1px solid #484848; 
                            border-top: 1px solid #484848; 
                            background-color: #222222; 
                            text-align: left;
                            font-size: 10pt;">
                            The preferred method to avoid this weakness is to include the unique token in a hidden field.
                            This will send the value in the body of the HTTP request, which is less prone to exposure
                            than the URL.<br>
                            Short session timeouts or requiring the user to re-authenticate or use CAPTCHA
                            systems can also protect against this form of attack.
                        </p>
                        <div>
                            <ul>
                                <li>
                                    <a href="https://www.owasp.org/index.php/Top_10_2013-A8-Cross-Site_Request_Forgery_%28CSRF%29" style="color: #76DEFC; text-decoration: none;">
                                        Official OWASP page on Cross-Site Request Forgery
                                    </a>
                                </li>
                                <li>
                                    <a href="http://en.wikipedia.org/wiki/Cross-site_request_forgery" style="color: #76DEFC; text-decoration: none;">
                                        Wikipedia page on Cross-Site request forgery.
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <form action="Servlet01" method="get" 
                            style="padding: 5px 10px 5px 10px;
                            border-bottom: 1px solid #484848; 
                            border-top: 1px solid #484848; 
                            background-color: #222222; 
                            text-align: left;
                            font-size: 10pt;">
                                Select another page: 
                                <select name="dropElement">
                                    <option value="home">Home</option>
                                    <option value="owasp01">OWASP01 - Injection</option>
                                    <option value="owasp02">OWASP02 - Broken Authentication and Session Management</option>
                                    <option value="owasp03">OWASP03 - Cross-Site Scripting (XSS)</option>
                                    <option value="owasp04">OWASP04 - Insecure Direct Object References</option>
                                    <option value="owasp05">OWASP05 - Security Misconfiguration </option>
                                    <option value="owasp06">OWASP06 - Sensitive Data Exposure </option>
                                    <option value="owasp07">OWASP07 - Missing Function Level Access Control</option>
                                    
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