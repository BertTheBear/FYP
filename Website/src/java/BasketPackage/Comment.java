/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package BasketPackage;

import login.HTMLFilter;

/**
 *
 * @author Mike
 */
public class Comment {
    
    private String itemID;
    private String userID;
    private String comment;
    private String commentID;
    
    public String getItemID() { return itemID;}
    public String getUserID() { return userID;}
    public String getCommentID() { return commentID;}
    public String getComment() { return comment;}
    
    public void setItemID(String itemID) { this.itemID = itemID;}
    public void setUserID(String userID) { this.userID = userID;}
    public void setCommentID() { commentID = itemID + userID;}
    public void setComment(String comment) { this.comment = HTMLFilter.filter(comment);}
    
}
