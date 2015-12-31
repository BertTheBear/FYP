/*
Group members: 
Denis Holmes	12140031
Shaun Gilbert	12153176
Michael Hallinan	12134635
*/

/**
 * Cart Bean for use in web-site
 *
 * @author Craig R. McClanahan
 * @author Tim Tye
 * @author/editor 12134635 Michael Hallinan
 * 
 * @version $Revision: 466607 $ $Date: 2015-04-19 21:34:01 (Sun, 19 April 2015) $
 */

/*

Based off of code found at http://www.java2s.com/Tutorial/Java/0360__JSP/JSPDummyShoppingCart.htm
 Code is edited to conform to personal project, but is based off of code shown

*/
package BasketPackage;

import javax.servlet.http.*;
import java.util.*;

public class CartBean {

    //Create a vector and call him victor because why not?

    Vector victor = new Vector();
    
    //Set initial values to null
    String submit = null;
    String item = null;

    private void addItem(String name) {
        victor.addElement(name);
    }

    private void removeItem(String name) {
        victor.removeElement(name);
    }

    public void setItem(String name) {
        item = name;
    }

    /**
     *
     * @param submit
     */
    public void setSubmit(String submit) {
        this.submit = submit;
    }

    public String[] getItems() {
        String[] s = new String[victor.size()];
        victor.copyInto(s);
        return s;
    }

    public void processRequest(HttpServletRequest request) {
        if(item != null) {
            try {
                if (submit == null) {
                    addItem(item);
                }
                else
                    switch (submit) {
                        case "add":
                            addItem(item);
                            break;
                        case "remove":
                            removeItem(item);
                            break;
                    }
            } catch(NullPointerException ex) {
                System.out.println(ex);
            }
        }

        // reset at the end of the request
        reset();
    }

    // reset all values to null. This is called after processRequest
    private void reset() {
        submit = null;
        item = null;
    }
}
