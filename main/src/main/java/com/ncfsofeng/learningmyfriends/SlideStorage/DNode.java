package com.ncfsofeng.learningmyfriends.SlideStorage;

public class DNode{
    private Slide data;
    private DNode next;
    private DNode previous;

    public DNode(Slide the_data){
        data = the_data;
        next = null;
        previous = null;
    }

    public Slide getData(){
        return data;
    }

    public DNode getNext(){
        return next;
    }

    public DNode getPrevious(){
        return previous;
    }

    public void setData(Slide the_data){
        data = the_data;
    }

    public void setNext(DNode n){
        next = n;
    }

    public void setPrevious(DNode p){
        previous = p;
    }
}

