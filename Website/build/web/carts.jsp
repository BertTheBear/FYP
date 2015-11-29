<%-- 
    Document   : carts
    Created on : 23-Apr-2015, 09:59:39
    Author     : http://www.java2s.com/Tutorial/Java/0360__JSP/JSPDummyShoppingCart.htm
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <jsp:useBean id="cart" scope="session" class="BasketPackage.CartBean" />

    <jsp:setProperty name="cart" property="*" />
    <%
      cart.processRequest(request);
    %>


    <br> You have the following items in your cart:
    <ol>
    <% 
      String[] items = cart.getItems();
      for (int i=0; i<items.length; i++) {
    %>
    <li> <% out.print(BasketPackage.HTMLFilter.filter(items[i])); %> 
    <%
      }
    %>
    </ol>

</html>
