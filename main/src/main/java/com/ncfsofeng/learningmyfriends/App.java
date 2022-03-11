package com.ncfsofeng.learningmyfriends;

import java.awt.*;
/**
 * App.java
 * @author Ender Fluegge and Damien Razdan
 *
 *Main application for backend. Webserver is created here as well as the project being worked on!
 *
 */
import com.ncfsofeng.learningmyfriends.SlideStorage.Project;
public class App  
{
    public static void main( String[] args ) throws Exception
    {
        // Read bytes into a FileInputStream
        Project p = Project.getInstance();
        // Create the new WebView
        new WebServer(8080, p);
        // Get the height and width of the main display.
        Dimension screenSize = Toolkit.getDefaultToolkit().getScreenSize();
        new WebView("http://localhost:8080/index.html", false, true, screenSize.width, screenSize.height);
    }
}
