<%-- 
    Document   : owasp04
    Created on : 11-Mar-2015, 20:36:41
    Author     : Mike
--%>
    
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ page errorPage="GeneralError.jsp" %>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>04 - Insecure Direct Object References </title>
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
                            <i>OWASP Element 04: Insecure Direct Object References </i>
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
                            Insecure Direct Object references are when the destination of a reference to an 
                            object is not properly secured and it can be manipulated. This can be used to access 
                            another user's account, and manipulate their data. <br>
                            This can be used for password resets, account charges, retrieve sensitive information etc.<br>
                            This sort of flaw can be easily exploitable and compromise all data referenced by the parameter.
                            Attackers may also be able to access all data of that type on the system.
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
                            The impact of this on a system is that it could compromise all data referenced
                            by that parameter. Account values in a banking system may have been tampered with
                            and all transactions for those accounts would need to be checked. This could cost 
                            a lot of money and business.<br>
                            From a business perspective, public exposure of this vulnerability would mean
                            reduced trust from customers and potentially a large loss of business.
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
                            For example, in an online banking program the Object references are not properly secured.
                            An attacker decides to take advantage of this and access other user accounts.
                            If the application uses unverified data in a SQL call that may access something 
                            such as account information, this can be modified so that it accesses a different account.<br> <br>
                            All that the attacker would need to do is modify which account number would be in the field, and they
                            would be able to withdraw money from other user accounts, or transfer from other accounts into their own.
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
                    Preventing this weakness can be as simple as checking each use of a direct 
                    object reference. Each use of a direct object reference from an 
                    untrusted source will be checked to include an access control check in order
                    to ensure that the user is authorised for the requested object.
                    <br> <br>
                    Another possibility is to use arbitrary values that are processed by the 
                    server. This way, forms will only ever send information 
                    such as "01" or "02", and these values will be processed by the server to link to the
                    appropriate objects.
                </p>
                <p style="text-align:center;padding: 5px 5px 0px 5px; background-color: transparent;
                   font-size: 12pt; margin-bottom: 0; margin-top: 0;">
                    External Links
                </p>
                <div>
                    <ul>
                        <li>
                            <a href="https://www.owasp.org/index.php/Top_10_2013-A4-Insecure_Direct_Object_References" style="color: #76DEFC; text-decoration: none;">
                                Official OWASP page on Insecure Direct Object References
                            </a>
                        </li>
                        <li>
                            <a href="https://blog.logrhythm.com/digital-forensics/detecting-and-defending-against-insecure-direct-object-reference-vulnerabilities-using-log-data-part-1/" style="color: #76DEFC; text-decoration: none;">
                                Blog on the detection and Defense against insecure direct object references.
                            </a>
                        </li>
                        <li>
                            <a href="http://www.quora.com/What-are-the-differences-between-missing-function-level-access-control-and-insecure-direct-object-references" style="color: #76DEFC; text-decoration: none;">
                                Explanation of the difference between Missing Function Level Access Control and Insecure Direct Object References.
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