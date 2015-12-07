/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package database;

/**
 *
 * @author Mike
 * http://met.guc.edu.eg/OnlineTutorials/JSP%20-%20Servlets/Full%20Login%20Example.aspx#
 */
import java.sql.*;
import java.util.*;

public class ConnectionManager {

    static Connection con;
    static String url;

    public static Connection getConnection() {

        try {
            String databaseName = "ShopDB";
            url = "jdbc:derby://localhost:1527/" + databaseName;
            
            String username = "toor";
            String password = "4uldo0!";

            try {
                con = DriverManager.getConnection(url, username, password);
                System.out.println("Successfully connected to database.");
            } catch (SQLException ex) {
                System.out.println("Inner error thrown");
                System.out.println(ex.getMessage());
            }
        } catch (Exception e) {
            System.out.println("Outer error thrown");
            System.out.println(e);
        }

        return con;
    }
}
