<%-- 
    Document   : owasp02
    Created on : 11-Mar-2015, 20:36:27
    Author     : Mike
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ page errorPage="GeneralError.jsp" %>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>02 - Broken Authentication and Session Management </title>
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
                            <i>OWASP Element 02: Broken Authentication and Session Management </i>
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
                            Broken Authentication and Session Management can be caused by developers 
                            building custom authentication or session management schemes incorrectly.
                            Typical flaws include timeouts, password management, secret questions, etc. 
                            and these can be easily easily exploited for malicious reasons. <br>
                            Examples of this are when session IDs or passwords are exposed in the page URL
                            or are not protected by encryption or hashing, and can be intercepted by software or
                            man-in-the-middle attacks.
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
                            Typical impacts of this scenario are exposed client information or passwords, which
                            can allow others to impersonate those users, commit credit card fraud, or enter their 
                            accounts and retrieve more personal information for other malicious gains. <br>
                            If an admin or other important account is breached in this way, then the entire system can be compromised.
                        </p>
                        <p style="text-align:center;padding: 5px 5px 0px 5px; background-color: transparent;
                           font-size: 12pt; margin-bottom: 0; margin-top: 0;">
                            Typical Impact Scenario
                        </p>
                        <div style="padding: 5px 5px 5px 5px;
                            border-bottom: 1px solid #484848; 
                            border-top: 1px solid #484848; 
                            background-color: #222222; 
                            text-align: left;
                            font-size: 10pt;">
                            Below is an example scenario. This particular case is URL rewriting, 
                            where Session IDs are exposed in the URL, though more cases exist.
                            If you input a username and password below, and submit
                            then you will be brought to another page that will show you the username and password 
                            contained in the URL. <br>
                            <br>
                            
                        <form action="Servlet02" method="get" style="padding: 5px 5px 5px 5px;border-bottom: 1px solid #484848; border-top: 1px solid #484848;">
                            Username: &nbsp;<input type="text" name="username">
                            Password: &nbsp;<input type="password" name="password" />
                            <input type="submit" value="Log in" />
                        </form>
                            <br>
                            This is a major security breach in the case that you would need to send this URL to anybody, 
                            or that anybody could check your web history. If anybody were to be able to intercept that 
                            URL through the use of a proxy or other software, they would also have access to your account.
                        </div>
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
                            A single set of strong authentication and session management controls can be very effective 
                            at combatting this type of attack. Having a simple but secure interface for other developers
                            to build upon, or copy, can be useful as many of these problems are caused when creating custom 
                            security interfaces. <br>
                            Care must also be taken to prevent use of Cross-Site Scripting(XSS) from being used to steal
                            session IDs (This is detailed further in OWASP03).
                        </p>
                        <p style="text-align:center;padding: 5px 5px 0px 5px; background-color: transparent;
                           font-size: 12pt; margin-bottom: 0; margin-top: 0;">
                            External Links
                        </p>
                        <div>
                            <ul>
                                <li>
                                    <a href="https://www.owasp.org/index.php/Top_10_2013-A2-Broken_Authentication_and_Session_Management" style="color: #76DEFC; text-decoration: none;">
                                        Official OWASP page on Broken Authentication and Session Management.
                                    </a>
                                </li>
                                <li>
                                    <a href="http://www.upenn.edu/computing/security/swat/SWAT_Top_Ten_A3.php" style="color: #76DEFC; text-decoration: none;">
                                        Penn University SWAT description of Broken Authentication and Session Management.
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
