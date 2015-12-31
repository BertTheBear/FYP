<%-- 
    Document   : Error404
    Created on : 11-Mar-2015, 18:54:42
    Author     : Mike
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page isErrorPage="true" %>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Oh dear!</title>
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
                404: Page not found.
            </h1>
        </div>
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
                            <i>Oh dear. We can't seem to find that page.</i>
                        </p>
                        
                        <p style="color:White;
                            padding: 5px 5px 5px 5px;
                            border-bottom: 1px solid #484848; 
                            border-top: 1px solid #484848; 
                            background-color: #222222; 
                            text-align: left;
                            font-size: 10pt;">
                            The page you are looking for can't seem to be found.<br>
                            It may have been removed, renamed, or the link you used is no longer valid. <br><br>
                            In the meantime, enjoy this duck that we <i>did</i> find... <br>Or is it a goose?<br>
                            <br>
                            <a href='index.html' style='color: #76DEFC; text-decoration: none; text-align: centre;'> &gt; Back to Main Page &lt; </a>
                        </p>
                   </td>
                </tr>
            </table>
        </div>
    </body>
</html>
