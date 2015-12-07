
package BasketPackage;

import javax.servlet.http.*;
import java.util.*;
/**
 *
 * @author Mike
 */
public class ItemBean {
    
    private Vector comments = new Vector();
    
    private String itemName = "";
    private String itemDescription = "";
    private String itemID = null;
    private double price = 0;
    private int stock = 0;
    
    /**
     *
     * @param comment
     */
    public void addComment(Comment comment) {    //May replace this with a comment object
        comments.addElement(comment);
    }
    public void removeComment(String comment) {
        comments.removeElement(comment);
    }
    
    
    public void setDescription(String desc) { itemDescription = desc;}
    public void setName(String name) { itemName = name;}
    public void setID(String id) { itemID = id;}
    public void setPrice(double price) { this.price = price; }
    public void setStock(int stock) { this.stock = stock; }
    
    
    public String getDescription() { return itemDescription; }
    public String getName() { return itemName; }
    public String getID() { return itemID;}
    public double getPrice() { return price; }
    public int getStock() {return stock;}
}
