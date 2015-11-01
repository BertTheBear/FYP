<%-- 
    Document   : shadyWebsite
    Created on : 17-Mar-2015, 15:50:48
    Author     : Mike
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <title>Shady Website</title>
        <meta charset="UTF-8">
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
            <h1 style="	font-weight: normal; 
                letter-spacing: .005em; color: White;  
                font-size: 24pt;
                text-align: Left;">
                The OWASP Nest
            </h1>
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
                            <i>Please Sign in:</i>
                        </p>
                            <!-- Actual project content starts here.-->
                            
                            <p style="padding: 5px 5px 5px 5px;
                            border-bottom: 1px solid #484848; 
                            border-top: 1px solid #484848; 
                            background-color: #222222; 
                            text-align: left;
                            font-size: 12pt;">
                                Oh dear! You seem to have been logged out for some reason. <br>
                                Please log in again below:
                            </p>
                        <form action="Servlet00" method="get" 
                            style="padding: 5px 0px 5px 0px;
                            border-bottom: 1px solid #484848; 
                            border-top: 1px solid #484848; 
                            background-color: #222222; 
                            text-align: left;
                            font-size: 12pt;">
                                Username: &nbsp;<input type="text" name="username">
                                Password: &nbsp;<input type="password" name="password" />
                            <input type="submit" value="Log in" />
                        </form>
                            <p style="padding: 5px 5px 5px 5px;
                            border-bottom: 1px solid #484848; 
                            border-top: 1px solid #484848; 
                            background-color: #222222; 
                            text-align: left;
                            font-size: 10pt;">
                                This website looks legitimate, and the original link may have looked authentic,
                                but it might ask you to log in and will then save your information for use in fraud
                                or other illegal activities.<br>
                                (Note: The above log-in does not work and will cause an error)<br>
                                <br>
                                <a href="owasp10.jsp" style="color: #76DEFC; text-decoration: none;">
                                    Click here to go back to the OWASP10 page.
                                </a>
                            </p>
                    </td>
                </tr>
            </table>
        </div>
    </body>
</html>

