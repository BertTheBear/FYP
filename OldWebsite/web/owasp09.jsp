<%-- 
    Document   : owasp09
    Created on : 11-Mar-2015, 20:37:18
    Author     : Mike
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ page errorPage="GeneralError.jsp" %>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>09 - Using Components with Known Vulnerabilities</title>
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
                            <i>OWASP Element 09: Using Components with Known Vulnerabilities</i>
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
                            This form of flaw is incredibly widespread, and is very difficult to detect.<br>
                            Thankfully it is not as easy to exploit as some of the other flaws. Attackers must 
                            identify a weak component through scanning or manual analysis.<br>
                            This is caused by failure to ensure that all components and libraries are up to date,
                            but this is very difficult to do in a large team because many members of the team 
                            will probably not even know all of the components they are using.
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
                            The typical impact of this sort of flaw is that you become more susceptible to the other 
                            types of attacks, such as Injection, XSS, Broken Access Control, etc.<br>
                            The impact can range from incredibly minimal to incredibly dangerous and data compromise.
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
                            Typical impact scenarios are usually simply that the code is more 
                            susceptible to the other types of attacks mentioned in the OWASP report. <br>
                            This problem only becomes worse if the code is frequently used by multiple areas,
                            or has many programs dependent on it.
                        </p>
                        <p style="text-align:center;padding: 5px 5px 0px 5px; background-color: transparent;
                           font-size: 12pt; margin-bottom: 0; margin-top: 0;">
                            Methods to avoid this weakness
                        </p>
                        <ol style="padding: 5px 5px 5px 25px;
                            border-bottom: 1px solid #484848; 
                            border-top: 1px solid #484848; 
                            background-color: #222222; 
                            text-align: left;
                            font-size: 10pt;">
                            <li>
                                Identify all components in use.
                            </li>
                            <li>
                                Monitor security of these components and keep them up to date.
                            </li>
                            <li>
                                Establish security policies governing component use, 
                                such as requiring certain licenses or passing of certain tests.
                            </li>
                            <li>
                                Consider adding security wrappers to disable unused functionality or known weak of vulnerable aspects.
                            </li>
                        </ol>

                        <p style="text-align:center;padding: 5px 5px 0px 5px; background-color: transparent;
                           font-size: 12pt; margin-bottom: 0; margin-top: 0;">
                            External Links
                        </p>
                        <div>
                            <ul>
                                <li>
                                    <a href="https://www.owasp.org/index.php/Top_10_2013-A9-Using_Components_with_Known_Vulnerabilities" style="color: #76DEFC; text-decoration: none;">
                                        Official OWASP page on Using Components with Known Vulnerabilities
                                    </a>
                                </li>
                                <li>
                                    <a href="http://www.aspectsecurity.com/research-presentations/the-unfortunate-reality-of-insecure-libraries" style="color: #76DEFC; text-decoration: none;">
                                        Presentation on "The Unfortunate Reality of Insecure Libraries"
                                    </a>
                                </li>
                                <li>
                                    <a href="http://en.wikipedia.org/wiki/Open-source_software_security" style="color: #76DEFC; text-decoration: none;">
                                        Wikipedia page on Open-source software security.
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