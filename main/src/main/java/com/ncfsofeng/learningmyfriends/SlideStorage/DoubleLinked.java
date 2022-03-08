package com.ncfsofeng.learningmyfriends.SlideStorage;

//This class stores  a Doubly-Linked List
//It supports any comparable data type


public class DoubleLinked{
    DNode start;
    DNode end;
    int len;

    //Creates an empty linked list
    public void DoubleLinked(){
        start = null;
        end = null;
        len = 0;
    }

    //Appends a new data item to the end of the list
    public void append(Slide the_data){
        if (end == null){
            end = new DNode(the_data);
            start = end;
        }
        else{
            DNode new_node = new DNode(the_data);
            DNode old_end = end;

            new_node.setPrevious(old_end);
            old_end.setNext(new_node);
            end = new_node;
        }
        len = len + 1;
    }

    //Returns the number of items in the list
    public int getSize(){
        return len;
    }

    //Prints the contents of the list
    public void print(){
        DNode current = start;
        String to_print = "";

        while(current != null){
            to_print = to_print + current.getData().toString() + " ";
            current = current.getNext();
        }

        System.out.println(to_print);
    }

    public void printBackwards(){
        DNode current = end;
        String to_print = "";

        while(current != null){
            to_print = to_print + current.getData().toString() + " ";
            current = current.getPrevious();
        }

        System.out.println(to_print);
    }

}


