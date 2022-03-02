package com.ncfsofeng.learningmyfriends;

import java.io.IOException;
import java.net.InetSocketAddress;

import com.sun.net.httpserver.*;

public class WebServer {
    private int _port;
    private HttpServer _server;

    public WebServer(int port) throws IOException {
        this._port = port;
        this._server = HttpServer.create(new InetSocketAddress(this._port), 0);


        this._server.createContext("/", new IndexHandler());

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