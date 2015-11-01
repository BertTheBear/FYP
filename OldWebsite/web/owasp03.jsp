<%-- 
    Document   : owasp03
    Created on : 11-Mar-2015, 20:36:34
    Author     : Mike
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ page errorPage="GeneralError.jsp" %>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>03 - Cross-Site Scripting</title>
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
                            <i>OWASP Element 03: Cross-Site Scripting (XSS)</i>
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
                            Cross-Site Scripting is very similar to Injection flaws. Whereas Injection Flaws 
                            are caused by unsanitised data being sent to the backend system, XSS can happen when 
                            this data is simply redisplayed to the requester.<br>
                            XSS is the most prevalent web application security flaw. These are most commonly caused 
                            by unsanitised data for forms and other front-end web-site functionalities.
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
                            Attackers can execute scripts in victim's browsers to hijack user sessionIDs and steal personal 
                            information(Through flaws such as those caused by OWASP02 - Broken Authentication and Session 
                            Management), insert hostile content, redirect users to dangerous websites, and install malware etc.<br>
                            Though Cross-Site Scripting and code injection is not always malicious, and can be used to alter a page
                            in such a way to be more beneficial for the user, it is often much more safe to prevent any 
                            manipulation or code injection on your website.
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
                            There are two types of Cross-Site Scripting: Reflected(Non-persistent) and Persistent.<br>
                            <br>
                            Reflected is the more common variant and consists of entering code such as HTML 
                            or JavaScript into the website through a search funcionality, or username entry. 
                            This code is only executed once. This can be used to steal information from the site or to 
                            alter the site in some shape or form.
                            <br> <br>
                            Persistent is when the code is saved onto the website. This can be done through 
                            the use of commenting or guestbook signings. This is potentially much more damaging
                            than reflected as it is executed each time the page is opened. This can be used to 
                            steal the sessionIDs of everybody who views the page, as stated above.<br>
                            A famous example of this is the Samy Worm, in which somebody wrote a small code 
                            that executed every time his MySpace profile was opened and it would infect the 
                            viewers' profiles to also contain the worm.
                            <br>
                            <br>
                            For example, if you enter anything into the form below, 
                            we can pretend it contained malicious code, and
                            it will alter the redirect page to look different etc.
                        <form action="Servlet02" method="get" style="padding: 5px 5px 5px 5px;border-bottom: 1px solid #484848; border-top: 1px solid #484848;">
                            Username: &nbsp;<input type="text" name="input"> 
                            <input type="submit" value="Log in" />
                        </form> 
                        This is an example of Reflected XSS, but if I were able to save the code 
                        onto the website through the use of a quest book or comment system, then 
                        it would be persistent.
                            
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
                            Methods to prevent XSS are similar to those used to prevent Injection. <br>
                            Input sanitisation is the most common and straightforward way of preventing this. 
                            An example of this is replacing all inputs of special characters by users with 
                            their HTML equivalents such as replacing &lt; with <tt>"&&#108t;"</tt>. <br> 
                            This prevents the input from being read as executable code by the browser.
                        </p>
                        <p style="text-align:center;padding: 5px 5px 0px 5px; background-color: transparent;
                           font-size: 12pt; margin-bottom: 0; margin-top: 0;">
                            External Links
                        </p>
                        <div>
                            <ul>
                                <li>
                                    <a href="https://www.owasp.org/index.php/Top_10_2013-A3-Cross-Site_Scripting_%28XSS%29" style="color: #76DEFC; text-decoration: none;">
                                        Official OWASP page on Cross-Site Scripting
                                    </a>
                                </li>
                                <li>
                                    <a href="http://en.wikipedia.org/wiki/Code_injection" style="color: #76DEFC; text-decoration: none;">
                                        Wikipedia's entry on Code injection.
                                    </a>
                                </li>
                                <li>
                                    <a href="https://community.rapid7.com/community/nexpose/blog/2013/06/20/xss-vs-injection" style="color: #76DEFC; text-decoration: none;">
                                        A quick summary of the differences between Injection and Cross-Site Scripting.
                                    </a>
                                </li>
                                <li>
                                    <a href="https://www.owasp.org/index.php/XSS_%28Cross_Site_Scripting%29_Prevention_Cheat_Sheet" style="color: #76DEFC; text-decoration: none;">
                                       OWASP XSS prevention cheat-sheet.
                                    </a>
                                </li>
                                <li>
                                    <a href="http://en.wikipedia.org/wiki/Samy_%28computer_worm%29" style="color: #76DEFC; text-decoration: none;">
                                       Wikipedia page on the Samy Worm.
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
