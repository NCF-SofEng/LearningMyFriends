package com.ncfsofeng.learningmyfriends;

import java.io.IOException;
import java.io.InputStream;
import java.net.InetSocketAddress;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;

import com.sun.net.httpserver.*;

public class WebServer {
    private int _port;
    private HttpServer _server;

    public WebServer(int port) throws IOException {
        this._port = port;
        this._server = HttpServer.create(new InetSocketAddress(this._port), 0);


        this._server.createContext("/ping", new IndexHandler());
        this._server.createContext("/update", new UpdateHandler());

        // Create a handler for every other path
        this._server.createContext("/", new FileHandler());
        this._server.start();
    }

    public HttpServer getServer() {
        return this._server;
    }
}


class IndexHandler implements HttpHandler {
    public void handle(HttpExchange t) throws IOException {
        String response = "Hello World!";
        t.sendResponseHeaders(200, response.length());
        t.getResponseBody().write(response.getBytes());
        t.getResponseBody().close();
    }
}

class FileHandler implements HttpHandler {
    @Override
    public void handle(final HttpExchange t) throws IOException {
        // Get the path of the request
        String path = t.getRequestURI().getPath();

        
        URL resource = getClass().getClassLoader().getResource("web" + path);
        if (resource == null) {
            t.sendResponseHeaders(404, 0);
            t.getResponseBody().close();
            return;
        }

        // Get the content of the file
        byte[] content = new byte[0];
        try {
            content = Files.readAllBytes(Paths.get(resource.toURI()));
        } catch (Exception e) {
            e.printStackTrace();
        }

        // If the file ended with ".html", we assume it is a HTML file and set the mime type.
        String mime = "text/html";
        if (path.endsWith(".html")) {
            mime = "text/html";
        } else if (path.endsWith(".js")) {
            mime = "text/javascript";
        } else if (path.endsWith(".css")) {
            mime = "text/css";
        } else if (path.endsWith(".png")) {
            mime = "image/png";
        } else if (path.endsWith(".jpg")) {
            mime = "image/jpeg";
        } else if (path.endsWith(".gif")) {
            mime = "image/gif";
        } else if (path.endsWith(".mjs")) {
            mime = "text/javascript";
        }

        t.getResponseHeaders().set("Content-Type", mime);

        // Send the response
        t.sendResponseHeaders(200, content.length);
        // set the mime type header
        t.getResponseBody().write(content);
        t.getResponseBody().close();
    }
}

class UpdateHandler implements HttpHandler {
    public void handle(HttpExchange t) throws IOException {
        // Read Post Data from the request if it's a post request
        // This block gets the incoming data from the FrontEnd and reads it to a string.
        StringBuilder sb = new StringBuilder();
        {
            InputStream body = t.getRequestBody();
            int b;
            while ((b = body.read()) != -1) {
                sb.append((char) b);
            }
        }
        String postData = sb.toString();
    
        System.out.println(postData);
        String response = "Hello World!";
        t.sendResponseHeaders(200, response.length());
        t.getResponseBody().write(response.getBytes());
        t.getResponseBody().close();
    }
}
