package com.ncfsofeng.learningmyfriends;

/**
 * Hello world!
 *
 */
public class App  
{
    public static void main( String[] args ) throws Exception
    {
        // Create the new WebView
        new WebServer(8080);
        new WebView("https://88939c2a5c23.ngrok.io", false, true);
    }
}
