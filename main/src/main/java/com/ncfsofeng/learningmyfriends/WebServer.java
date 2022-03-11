package com.ncfsofeng.learningmyfriends;


import java.io.IOException;
import java.io.InputStream;
import java.net.InetSocketAddress;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

import com.ncfsofeng.learningmyfriends.SlideStorage.Project;
import com.sun.net.httpserver.*;

/**
 * WebServer.java
 * @author Ender Fluegge and Damien Razdan
 *
 * This class is an HTTP server that handles replying to requests from the frontend to the backend,
 * providing a form of one-way communication.
 */

public class WebServer {
    private int _port;
    private HttpServer _server;
    private Project project;

    /**
     * The Constructor for the WebServer class.
     * @param port The port to listen on.
     * @param p The Project instance for backend storage.
     * @throws IOException
     */
    public WebServer(int port, Project p) throws IOException {
        this._port = port;
        this._server = HttpServer.create(new InetSocketAddress(this._port), 0);
        this.project = p;


        // Bind all the routes for API endpoints
        this._server.createContext("/ping", new IndexHandler());
        this._server.createContext("/update", new UpdateHandler(this.project));
        this._server.createContext("/getSlide", new SlideRequester(this.project));
        this._server.createContext("/dump", new DumpSlides(this.project));
        this._server.createContext("/load", new Load(this.project));
        this._server.createContext("/save", new Save(this.project));
        this._server.createContext("/undoredo", new UndoRedo(this.project));
        this._server.createContext("/projectName", new ProjectNameUpdate(this.project));
        this._server.createContext("/export", new Export(project));

        // Create a handler for every other path
        this._server.createContext("/", new FileHandler());
        this._server.start();
    }

    /**
     * Return the owned server.
     * @return
     */
    public HttpServer getServer() {
        return this._server;
    }

    /**
     * Takes in a query string and returns a map of key-value pairs.
     * @param query The Query String to parse
     * @return A map of key-value pairs.
     */
    public static Map<String, String> queryToMap(String query) {
        if(query == null) {
            return null;
        }
        Map<String, String> result = new HashMap<>();
        for (String param : query.split("&")) {
            String[] entry = param.split("=");
            if (entry.length > 1) {
                result.put(entry[0], entry[1]);
            }else{
                result.put(entry[0], "");
            }
        }

        return result;
    }
}


/**
 * This class handles requests to the root of the server.
 */
class IndexHandler implements HttpHandler {
    public void handle(HttpExchange t) throws IOException {
        String response = "Hello World!";
        t.sendResponseHeaders(200, response.length());
        t.getResponseBody().write(response.getBytes());
        t.getResponseBody().close();
    }
}

/**
 * This class handles requests to specific files within the resources directory.
 */
class FileHandler implements HttpHandler {
    @Override
    public void handle(final HttpExchange t) throws IOException {
        // Get the path of the request
        String path = t.getRequestURI().getPath();

        // Make sure the 'web' directory is the root.
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

/**
 * This class is invoked on edit updates from the frontend
 */
class UpdateHandler implements HttpHandler {
    private Project project = Project.getInstance();
    public UpdateHandler(Project p) {
        this.project = p;
    }
    public void handle(HttpExchange t) throws IOException {
        // Read Post Data from the request if it's a post request
        // This block gets the incoming data from the FrontEnd and reads it to a string.
        Map<String, String> params = WebServer.queryToMap(t.getRequestURI().getQuery());
        StringBuilder sb = new StringBuilder();
        {
            InputStream body = t.getRequestBody();
            int b;
            while ((b = body.read()) != -1) {
                sb.append((char) b);
            }
        }

        int slideEditNumber = Integer.parseInt(params.get("slide")) - 1;
        String slideEditContent = sb.toString();
        // System.out.println("Creating new slide 1 :: " + slideEditNumber);

        if (project.search(slideEditNumber) == true) {
            //System.out.println("Creating new slide 2");
            project.editslide(slideEditNumber, slideEditContent);
            //System.out.println(5);
        } else {
            //System.out.println("Creating new slide 3");
            project.addslide(slideEditNumber, slideEditContent);
            //System.out.println(6);
        }

        // System.out.println(postData);
        String response = "Hello World!";
        t.sendResponseHeaders(200, response.length());
        t.getResponseBody().write(response.getBytes());
        t.getResponseBody().close();
    }
}

/**
 * This class serves slides to the frontend based on requests.
 */
class SlideRequester implements HttpHandler {
    private Project project = Project.getInstance();
    public SlideRequester(Project p) {
        this.project = p;
    }

    public void handle(HttpExchange t) throws IOException {
        Map<String, String> params = WebServer.queryToMap(t.getRequestURI().getQuery());
        String number = params.get("number");
        // Cast 'number' to string. 'num' is the requested slide number, will be called when you click on a slide on the frontend.
        int num = Integer.parseInt(number);

        // This just sends "Hello World!", it should send the HTML response.
        String response = project.getSlide(num - 1);
        t.sendResponseHeaders(200, response.length());
        t.getResponseBody().write(response.getBytes());
        t.getResponseBody().close();
    }
}

/**
 * Dumps all slides into a string, sending it back to the frontend.
 */
class DumpSlides implements HttpHandler {
    private Project project = Project.getInstance();
    public DumpSlides(Project p) {
        this.project = p;
    }

    public void handle(HttpExchange t) throws IOException {
        StringBuilder b = new StringBuilder();

        for (int i = 0; i < project.slides.size(); i++) {
            b.append(project.getSlide(i) + "|MYSPECIALDELIM|");
        }

        String response = b.toString();
        t.sendResponseHeaders(200, response.length());
        t.getResponseBody().write(response.getBytes());
        t.getResponseBody().close();
    }
}

/**
 * Triggered when a project's name updates
 */
class ProjectNameUpdate implements HttpHandler {
    private Project project = Project.getInstance();
    public ProjectNameUpdate(Project p) {
        this.project = p;
    }

    public void handle(HttpExchange t) throws IOException {
        Map<String, String> params = WebServer.queryToMap(t.getRequestURI().getQuery());

        // 'name' is the rename.
        String name = params.get("name");
        this.project.setProjectName(name);

        String response = "Hello World!";
        t.sendResponseHeaders(200, response.length());
        t.getResponseBody().write(response.getBytes());
        t.getResponseBody().close();
    }
}

/**
 * Triggered when an undo or redo request is sent.
 */
class UndoRedo implements HttpHandler {
    private Project project = Project.getInstance();
    public UndoRedo(Project p) {
        this.project = p;
    }

    public void handle(HttpExchange t) throws IOException {
        Map<String, String> params = WebServer.queryToMap(t.getRequestURI().getQuery());

        // Will be either "undo" or "redo"
        String action = params.get("action");
        int slideNumber = Integer.parseInt(params.get("number")) - 1;
        if (action.equalsIgnoreCase("undo")){
            this.project.undo(slideNumber);
        }
        else{
            this.project.redo(slideNumber);
        }

        String response = "Hello World!";
        t.sendResponseHeaders(200, response.length());
        t.getResponseBody().write(response.getBytes());
        t.getResponseBody().close();
    }
}

/**
 * Loads the project from the file system.
 */
class Load implements HttpHandler {
    private Project project = Project.getInstance();
    public Load(Project p) {
        this.project = p;
    }

    public void handle(HttpExchange t) throws IOException {
        StringBuilder sb = new StringBuilder();
        {
            InputStream body = t.getRequestBody();
            int b;
            while ((b = body.read()) != -1) {
                sb.append((char) b);
            }
        }

        String fileContents = sb.toString();
        // Send the contents of slide 1 at the end of this pleaseeeee
        this.project.load(fileContents);
        String response = "Hello World!";
        t.sendResponseHeaders(200, response.length());
        t.getResponseBody().write(response.getBytes());
        t.getResponseBody().close();
    }
}

/**
 * Saves the project to the file system.
 */
class Save implements HttpHandler {
    private Project project = Project.getInstance();
    public Save(Project p) {
        this.project = p;
    }

    public void handle(HttpExchange t) throws IOException {
        // This is called when the user clicks the save button on the frontend.
        this.project.save();
        String response = "Hello World!";
        t.sendResponseHeaders(200, response.length());
        t.getResponseBody().write(response.getBytes());
        t.getResponseBody().close();
    }
}

/**
 * Exports every slide to a single PDF file.
 */
class Export implements HttpHandler {
    private Project project = Project.getInstance();
    public Export(Project p) {
        this.project = p;
    }

    public void handle(HttpExchange t) throws IOException {
        // This is called when the user clicks the export button on the frontend.
        StringBuilder sb = new StringBuilder();
        {
            InputStream body = t.getRequestBody();
            int b;
            while ((b = body.read()) != -1) {
                sb.append((char) b);
            }
        }

        String contents = sb.toString();
        this.project.export(contents);
        String response = "Hello World!";
        t.sendResponseHeaders(200, response.length());
        t.getResponseBody().write(response.getBytes());
        t.getResponseBody().close();
    }
}