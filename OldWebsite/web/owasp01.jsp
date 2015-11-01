<%-- 
    Document   : owasp01
    Created on : 11-Mar-2015, 20:36:19
    Author     : Mike
--%>

<%
   
%>
    
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ page errorPage="GeneralError.jsp" %>
<!DOCTYPE html>
<html>
    <head>
        <title>01 - Injection</title>
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
                            <i>OWASP Element 01: Injection</i>
                        </p>
                        
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
                            Injection flaws occur when an application is able to send unchecked or unsanitised data to an interpreter. 
                            An example of this is putting code fragments in data fields with the intent of running 
                            the code, or altering the existing code behind the web-site.<br>
                            These are often found in LDAP, SQL, or NoSQL queries etc. These statements are then executed
                            by the system and can cause major and lasting harm to the host server. <br>
                            In simple terms, an Injection flaw allows an attacker to take control of something on the server side.
                            <br>
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
                            The impact of Injection attacks can range from loss of information to 
                            security exploits or complete system damage. These types of attacks can be used to gather sensitive 
                            client information such as credit-card information, passwords, and other personal data. 
                            These are possibly the most dangerous forms of attack as the attacker has access to your backend system. <br>
                            
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
                            A simple example of Injection flaws would be incorrectly filtered escape characters. Given the following code: <br>
                            <tt>statement = SELECT * FROM clients WHERE username = ' " + userName + " ';";</tt> <br>
                            this code will return a table with all users that have a name matching the data entered in the form for userName. 
                            If a user were to give the name <tt>' or '1='1</tt>, then the statement would return all usernames, or even if they 
                            were to use comments or damaging statements such as the name <tt>Robert'); DROP TABLE Students;--</tt> then they would block a large 
                            portion of the query as the interpreter may read it as a comment, and much of the system data could be lost.
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
                            The most common methods of avoiding this weakness is to use a safe API and avoid the interpreter entirely, or parameterised interface.
                            If this isn't possible, then limiting the characters available for input (Such as only allowing numbers and letters), 
                            or utilising specific escape syntax for any special characters for the interpreter will help prevent these types of attacks.<br>
                            Thankfully there are many mechanisms in place to help users to spot these kinds of errors in their systems and to prevent these types of attacks.
                            
                        </p>
                        <p style="text-align:center;padding: 5px 5px 5px 5px; background-color: transparent;
                           font-size: 12pt; margin-bottom: 0; margin-top: 0;">
                            External Links
                        </p>
                        <div>
                            <ul>
                                <li>
                                    <a href="https://www.owasp.org/index.php/Top_10_2013-A1-Injection" style="color: #76DEFC; text-decoration: none;">
                                        Official OWASP page on Injection.
                                    </a>
                                </li>
                                <li>
                                    <a href="http://xkcd.com/327/" style="color: #76DEFC; text-decoration: none;">
                                        A relevant humorous web-comic on the topic.
                                    </a>
                                </li>
                                <li>
                                    <a href="http://en.wikipedia.org/wiki/SQL_injection" style="color: #76DEFC; text-decoration: none;">
                                        Wikipedia's entry on SQL injection.
                                    </a>
                                </li>
                                <li>
                                    <a href="https://community.rapid7.com/community/nexpose/blog/2013/06/20/xss-vs-injection" style="color: #76DEFC; text-decoration: none;">
                                        A quick summary of the differences between Injection and Cross-Site Scripting.
                                    </a>
                                </li>
                            </ul>
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