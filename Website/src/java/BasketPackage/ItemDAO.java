/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package BasketPackage;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

/**
 *
 * @author Mike
 */
public class ItemDAO {
    
    static Connection currentCon = null;
    static ResultSet resultSet = null;

    public static ItemBean searchID(ItemBean bean) {

        
        //Sanitise input (Again)
        String id = HTMLFilter.filter(bean.getID());
        
        //preparing some objects for connection 
        Statement stmt = null;

        String tableName = "toor.item_table";

        //The query we will be using
        String searchQuery = "select * from " + tableName + " where id='" + id + "'";

        // This will be for checking that the data is correct. 
        // Will be removed before release
        System.out.println("ID searched is " + id);
        System.out.println("Query: " + searchQuery);

        //Try and catch in case of SQLException
        try {
            //Connect to the database
            currentCon = ConnectionManager.getConnection();
            //Create the required statement
            stmt = currentCon.createStatement();
            //Execute the SQL query in the database
            resultSet = stmt.executeQuery(searchQuery);

            if (!resultSet.next()) {
                System.out.println("Sorry, The item you searched for could not be found.");
                return null;
                
            } //If user exists set the isValid variable to true
            else {
                String itemID = resultSet.getString("id");
                String name = resultSet.getString("name");
                String description = resultSet.getString("description");
                double price = resultSet.getDouble("price");
                int stock = resultSet.getInt("stock");

                System.out.println("Item found");
                
                //Set variables
                bean.setID(itemID);
                bean.setName(name);
                bean.setDescription(description);
                bean.setPrice(price);
                bean.setStock(stock);
            }
        } catch (SQLException ex) {
            System.out.println("An Exception has occurred while searching! " + ex.getMessage());
        } 
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
