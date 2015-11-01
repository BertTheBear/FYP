<%-- 
    Document   : owasp07
    Created on : 11-Mar-2015, 20:37:03
    Author     : Mike
--%>
    
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ page errorPage="GeneralError.jsp" %>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>07 - Missing Function Level Access Control </title>
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
                            <i>OWASP Element 07: Missing Function Level Access Control </i>
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
                            Sometimes application functions are not protected properly and function level
                            protection can be managed via configuration, and this can be misconfigured.
                            Developers should usually include checks for their code, but this may have been forgotten.<br>
                            These are easily exploited if discovered, though thankfully they are easy to detect and fix.
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
                            Attackers can simply change the URL or appropriate parameter to a privileged function
                            This means that anonymous users could access unprotected private functions. <br>
                            These flaws allow attackers to access unauthorised functionality and can severely impact 
                            both the reputation of your company as well as reduce business values of the 
                            exposed functions and any data they process.
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
                            The most common use of this exploit would be to force any users to be redirected to another page.
                            This way any viewers of your site can be redirected to another site, which similar to OWASP04 - Insecure Direct Object References,
                            can be used to impersonate your site and gain access to sensitive data.<br>
                            Another function of this type of weakness is that when pages provide an 'action' parameter
                            to specify functions being invoked, it usually requires certain roles. If these roles aren't enforced, 
                            it means that restricted site functionalities may be invoked by unauthorised accounts
                            or even by anonymous users that are not logged in.
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
                            The easiest way to prevent this type of flaw is to have a consistent and easy 
                            to analyse authorisation module that will be invoked from all business functions. <br>
                            Thinking about your process for managing entitlements and ensuring that you can audit and update
                            easily can assist this process. Reducing the amount of hard coding can help in this. <br>
                            Denying all mechanisms by default and requiring explicit access for each function can 
                            help with encapsulation.
                                
                        </p>
                        <p style="text-align:center;padding: 5px 5px 0px 5px; background-color: transparent;
                           font-size: 12pt; margin-bottom: 0; margin-top: 0;">
                            External Links
                        </p>
                        <div>
                            <ul>
                                <li>
                                    <a href="https://www.owasp.org/index.php/Top_10_2013-A7-Missing_Function_Level_Access_Control" style="color: #76DEFC; text-decoration: none;">
                                        Official OWASP page on Missing Function Level Access Control
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
                                    <option value="owasp04">OWASP04 - Insecure Direct Object References</option>
                                    <option value="owasp05">OWASP05 - Security Misconfiguration </option>
                                    <option value="owasp06">OWASP06 - Sensitive Data Exposure </option>
                                        
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