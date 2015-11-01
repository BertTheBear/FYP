<%-- 
    Document   : GeneralError
    Created on : 11-Mar-2015, 18:55:27
    Author     : Mike
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<%@page isErrorPage="true" %>
<html>
    <head>
        <title>General Error Page</title>
    </head>
    <body style="color: White; 
          font-family: Arial, Helvetica, sans-serif; 
          font-size: 10pt; 
          background-color: Black;
          margin: 0; 
          padding: 0; 
          text-align: justify;">
        
        <div style="width:760px; 
             margin-left:auto; 
             margin-right:auto;">
            <h1 style="	font-weight: normal; 
                letter-spacing: .005em; color: White;  
                font-size: 24pt;
                text-align: Left;">
                Oops...</h1> <br>
            <table>
                <tr>
                    <td style="overflow: hidden; width: 740px; text-align: left; 
                        padding: 10px;background-color: #363636;vertical-align: top;">
                        <p style="text-align:center;padding: 5px 0px 5px 0px; background-color: #000000;
                           font-size: 14pt; margin-bottom: 7px; margin-top: 0;">
                            <i>You seem to have encountered an error.</i>
                        </p>
                        
                        <div style="width:760px; margin-left:auto; margin-right:auto;
                             text-align:center;padding: 10px 0px 15px 0px; background-color: #000000;
                             margin-bottom: 7px; margin-top: 0;border-bottom: 1px solid #484848; 
                             border-top: 1px solid #484848; background-color: #222222;">
                            <table width="100%" border="1">
                                <tr valign="top">
                                    <td width="40%"><b>Error:</b></td>
                                    <td>${pageContext.exception}</td>
                                </tr>
                                <tr valign="top">
                                    <td><b>URI:</b></td>
                                    <td>${pageContext.errorData.requestURI}</td>
                                </tr>
                                <tr valign="top">
                                    <td><b>Status code:</b></td>
                                    <td>${pageContext.errorData.statusCode}</td>
                                </tr>
                                <tr valign="top">
                                    <td><b>Stack trace:</b></td>
                                    <td>
                                <c:forEach var="trace" 
                                           items="${pageContext.exception.stackTrace}">
                                    <p>${trace}</p>
                                </c:forEach>
                                </td>
                                </tr>
                            </table>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</body>
</html>
