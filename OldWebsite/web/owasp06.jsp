<%-- 
    Document   : owasp06
    Created on : 11-Mar-2015, 20:36:57
    Author     : Mike
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ page errorPage="GeneralError.jsp" %>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>06 - Sensitive Data Exposure</title>
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
                            <i>OWASP Element 06: Sensitive Data Exposure</i>
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
                            Sensitive data exposure is a very common flaw, and 
                            is simply not encrypting sensitive data.
                            This makes the data easier to be stolen and is 
                            usually not a problem on its own but related to the other types of attacks.<br>
                            Examples of this are poor password hashing techniques 
                            and weak key generation and management.
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
                            Attackers do not break the encryptions directly. 
                            These attacks are difficult to exploit and usually consist of stealing keys
                            and man-in-the-middle attacks. Failure to properly encrypt data usually means that
                            any data stolen by attackers is easier to use.<br>
                            Failure usually compromises all data that should have been protected, 
                            which usually consists of important client information such as Credit card information, 
                            personal data, or health records.
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
                            <i>As part of an Injection attack:</i><br>
                            The application encrypts all data on the system, but this means that the information
                            is decrypted when it is sent out. If an injection attack manages to send all of the 
                            data from this system, it will all be decrypted. 
                            This means that the attackers will all have access to this unencrypted information,
                            which may include credit card information or passwords.<br>
                            <br>
                            <i>As part of stolen Broken Authentication and Session Management:</i><br>
                            An attacker manages to successfully obtain a sessionID from one of the users of a site
                            because of Broken Authentication. This now allows the attacker to access all of the encrypted
                            data files using the sessionID or stolen cookie. <br>
                            <br>
                            <i>Unsalted hash storage of passwords:</i><br>
                            If the site does not use salted encryption for their passwords, then if the encrypted passwords
                            are stolen as part of another vulnerability they are vulnerable to pre-computed rainbow 
                            table attacks.
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
                            Proper encryption methods is the most common form of protecting against Sensitive Data Exposures. <br>
                            Removing unnecessary sensitive data means that it cannot be stolen. <br>
                            Proper key management and algorithms is important for preventing attackers from being able to steal keys. <br>
                            Using Salted encryption for passwords(Unique encryption for each password) can slow down attackers long enough in worst-case situations
                            to allow for passwords to be changed.<br>
                            Disabling auto-complete on forms and other pages containing sensitive data prevents this information from being stored in the cache.
                        </p>
                        <p style="text-align:center;padding: 5px 5px 0px 5px; background-color: transparent;
                           font-size: 12pt; margin-bottom: 0; margin-top: 0;">
                            External Links
                        </p>
                        <div>
                            <ul>
                                <li>
                                    <a href="https://www.owasp.org/index.php/Top_10_2013-A6-Sensitive_Data_Exposure" style="color: #76DEFC; text-decoration: none;">
                                        Official OWASP page on Sensitive Data Exposure
                                    </a>
                                </li>
                                <li>
                                    <a href="https://crackstation.net/hashing-security.htm" style="color: #76DEFC; text-decoration: none;">
                                        Further information on Salted Password Hashing.
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