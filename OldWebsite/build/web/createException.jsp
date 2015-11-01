<%-- 
    Document   : createException
    Created on : 18-Mar-2015, 09:07:58
    Author     : puser
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ page errorPage="GeneralError.jsp" %>
<!DOCTYPE html>
<html>
<head>
   <title>Error Handling Creation Page</title>
</head>
    <body style="color: White; font-family: Arial, Helvetica, sans-serif; font-size: 10pt; background-color: Black;margin: 0; padding: 0; text-align: justify;">
<%
   // Throw an exception to invoke the error page
   int x = 1234;
   if (x != 0)
   {
      throw new RuntimeException("Sample Error Condition.");
   }
%>
This page should throw an exception.
</body>
</html>
