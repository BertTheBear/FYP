/*
Group members: 
Denis Holmes	12140031
Shaun Gilbert	12153176
Michael Hallinan	12134635
*/

/**
 * HTML filter utility.
 *
 * @author Craig R. McClanahan
 * @author Tim Tye
 * @author/editor 12134635 Michael Hallinan
 * 
 * @version $Revision: 466607 $ $Date: 2015-04-19 19:59:44 (Sun, 19 April 2015) $
 */

/*

Based off of code found at http://www.java2s.com/Tutorial/Java/0360__JSP/JSPDummyShoppingCart.htm
 Code is edited to conform to personal project, but is based off of code shown

*/

package BasketPackage;

public final class HTMLFilter {


    /**
     * Filter the specified message string for characters that are sensitive
     * in HTML.  This avoids potential attacks caused by including JavaScript
     * codes in the request URL that is often reported in error messages.
     * 
     * This helps as part of OWASP 2013 #3 Cross-Site Scripting.
     *      It's a form of Injection (OWASP 2013 #1) and the below 
     *      has been adapted to help prevent some other Injection also.
     *
     * @param toBeSanitised The message string to have its content checked
     * @return 
     */
    public static String filter(String toBeSanitised) {

        if (toBeSanitised == null)
            return (null);

        //Creates char array of length of input string.
        char notSanitised[] = new char[toBeSanitised.length()];
        //Puts characters from String into the array
        toBeSanitised.getChars(0, toBeSanitised.length(), notSanitised, 0);
        
        
        //Creates a MUTABLE sequence of characters. This is more efficient than 
        // creating a String and adding on each time. The max additional length 
        // is 50 for now. This may be increased depending on input size limitations
        StringBuilder cleaned = new StringBuilder(notSanitised.length + 250);
        //For each letter in input
        for (int i = 0; i < notSanitised.length; i++) {
            //If possibly dangerous character, replace with HTML Unicode
            switch (notSanitised[i]) {
            case '<':
                cleaned.append("&lt;");
                break;
            case '>':
                cleaned.append("&gt;");
                break;
            case '&':
                cleaned.append("&amp;");
                break;
            case '"':
                cleaned.append("&quot;");
                break;
            case '\'':
                cleaned.append("&#x27;");
                break;
            case '/':
                cleaned.append("&#x2F;");
                break;
            case ',':
                cleaned.append("&#44;");
                break;
            case '=':
                cleaned.append("&#61;");
                break;
            case '-':
                cleaned.append("&#45;");
                break;
            case '@':
                cleaned.append("&#64;");
                break;
            case ';':
                cleaned.append("&#59");
                break;
            case ':':
                cleaned.append("&#58;");
                break;
            case '(':
                cleaned.append("&#40;");
                break;
            case ')':
                cleaned.append("&#41;");
                break;
            default:
                //If not harmful, just place the character in the result array.
                cleaned.append(notSanitised[i]);
            }
        }
        //Return the StringBuilder as a String
        return (cleaned.toString());

    }


}