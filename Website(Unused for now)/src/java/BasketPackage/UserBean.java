/*
Group members: 
Denis Holmes	12140031
Shaun Gilbert	12153176
Michael Hallinan	12134635
*/
package BasketPackage;

/**
 *
 * @author Mike
 * http://met.guc.edu.eg/OnlineTutorials/JSP%20-%20Servlets/Full%20Login%20Example.aspx#
 */
public class UserBean {

    private String username;
    private String password;
    private String ID;
    private int type;
    public boolean valid;

    public String getID() {
        return ID;
    }

    public void setID(String newID) {
        ID = newID;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String newPassword) {
        password = newPassword;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String newUsername) {
        username = newUsername;
    }
    
    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean newValid) {
        valid = newValid;
    }
    
    public String redirect() {
        return "<meta http-equiv=\"refresh\" content=\"0; url=login.jsp\">";
    }
    
    public void logout() {
        username = null;
        password = null;
        ID = null;
        type = -1;
        valid = false;
    }
}
