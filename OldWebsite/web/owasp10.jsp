<%-- 
    Document   : owasp10
    Created on : 11-Mar-2015, 20:37:25
    Author     : Mike
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ page errorPage="GeneralError.jsp" %>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>10 - Unvalidated Redirects and Forwards</title>
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
                            <i>OWASP Element 10: Unvalidated Redirects and Forwards</i>
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
                            When applications use the actual name or key of an object when generating web-page forwards or redirects
                            the applications may not verify that the user is authorised for the target site or object.
                            Attackers can take advantage of this weakness to forward from your site into theirs. 
                            This can mean that the link will look authentic, and they can pretend to be a part 
                            of your website and steal user information etc.
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
                            The typical impact of this sort of flaw is that attackers will be able to 
                            impersonate your website through links to their own. If your site is 
                            something like online banking or purchases, then they can get access to credit
                            card information or bank information and steal money from your clients.<br>
                            These redirects may also be used to install malware on client systems or bypass security checks.
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
                            An example of this is in the link below. 
                            <br> <br>
                            <a href="Servlet01?dropElement=shadyWebsite" style="color: #76DEFC; text-decoration: none;text-align: center; padding: 5px 5px 5px 5px;border-bottom: 1px solid #484848; border-top: 1px solid #484848;">
                                http://www.owasp-nest.com/12134635/Servlet01?dropElement=shadyWebsite
                            </a>
                            <br> <br>
                            The beginning of the link looks like it 
                            would link to a page on this website, but they could use it to redirect to their own
                            website which may even look similar in the URL bar(Misspelling one of the words that 
                            may be overlooked, or <tt>.cc</tt> instead of <tt>.com</tt> etc.)
                            and it may then ask you to log back in, or fill in your data etc. <br>
                            The URL may be much longer in order to hide the actual website redirect, or may travel through 
                            numerous redirects and proxies before you arrive at the intended site.
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
                            The easiest way to avoid Uvalidated Redirects and Forwards is to simply stop 
                            using redirects and forwards.<br>
                            If they <i>must</i> be used, don't use user parameters in calculating the destination.<br>
                            Many web-sites with chat functionalities will warn the 
                    user if the web-site they are linked to is outside of the domain of the web-site.
                            
                        </p>
                        <p style="text-align:center;padding: 5px 5px 0px 5px; background-color: transparent;
                           font-size: 12pt; margin-bottom: 0; margin-top: 0;">
                            External Links
                        </p>
                        <div>
                            <ul>
                                <li>
                                    <a href="https://www.owasp.org/index.php/Top_10_2013-A10-Unvalidated_Redirects_and_Forwards" style="color: #76DEFC; text-decoration: none;">
                                        Official OWASP page on Unvalidated Redirects and Forwards
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
                                    <option value="owasp08">OWASP08 - Cross-Site Request Forgery </option>
                                    <option value="owasp09">OWASP09 - Using Components with Known Vulnerabilities</option>
                                    
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