/*
 Group members: 
 Denis Holmes           12140031
 Shaun Gilbert          12153176
 Michael Hallinan	12134635
 */
package login;

/**
 *
 * @author Mike
 * Based off of code found at:
 * http://met.guc.edu.eg/OnlineTutorials/JSP%20-%20Servlets/Full%20Login%20Example.aspx#
 */
import database.ConnectionManager;
import java.text.*;
import java.util.*;
import java.sql.Statement;
import java.sql.*;

public class UserDAO {

    static Connection currentCon = null;
    static ResultSet resultSet = null;

    public static UserBean login(UserBean bean) {

        //preparing some objects for connection 
        Statement stmt = null;

        String username = bean.getUsername();
        String password = bean.getPassword();
        String tableName = "toor.user_table";

        //The query we will be using
        String searchQuery = "select * from " + tableName + " where username='"
                + username + "' AND password='" + password + "'";

        // This will be for checking that the data is correct. 
        // Will be removed before release
        System.out.println("Your user name is " + username);
        System.out.println("Your password is " + password);
        System.out.println("Query: " + searchQuery);

        //Try and catch in case of SQLException
        try {
            //Connect to the database
            currentCon = ConnectionManager.getConnection();
            //Create the required statement
            stmt = currentCon.createStatement();
            //Execute the SQL query in the database
            resultSet = stmt.executeQuery(searchQuery);

            // If user does not exist set the isValid variable to false
            if (!resultSet.next()) {
                System.out.println("Sorry, you are not a registered user! Please sign up first");
                bean.setValid(false);
            } //If user exists set the isValid variable to true
            else {
                String accountID = resultSet.getString("id");
                String type = resultSet.getString("type");

                System.out.println("Welcome " + username);
                bean.setID(accountID);
                bean.setType(Integer.parseInt(type));
                bean.setValid(true);
                
                //Set password to null in order to limit sensitive data saved
                bean.setPassword(null);
            }
        } catch (SQLException ex) {
            System.out.println("Log In failed: An Exception has occurred! " + ex.getMessage());
        } //some exception handling
        finally {
            //close all of the connections
            if (resultSet != null) {
                try {
                    resultSet.close();
                } catch (Exception e) {
                    //Catch exception but no error message yet
                }
                resultSet = null;
            }

            if (stmt != null) {
                try {
                    stmt.close();
                } catch (Exception e) {
                    //Catch exception but no error message yet
                }
            }

            if (currentCon != null) {
                try {
                    currentCon.close();
                } catch (Exception e) {
                    //Catch exception but no error message yet
                }

                currentCon = null;
            }
        }

        return bean;

    }
}
