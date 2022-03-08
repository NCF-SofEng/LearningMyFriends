package com.ncfsofeng.learningmyfriends;

import java.awt.*;

import com.ncfsofeng.learningmyfriends.SlideStorage.Project;

/**
 * Hello world!
 *
 */
public class App  
{
    public static void main( String[] args ) throws Exception
    {
        Project p = new Project();
        // Create the new WebView
        new WebServer(8080, p);
        // Get the height and width of the main display.
        Dimension screenSize = Toolkit.getDefaultToolkit().getScreenSize();
        new WebView("http://localhost:8080/index.html", false, true, screenSize.width, screenSize.height);
    }
}
