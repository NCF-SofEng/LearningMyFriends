package com.ncfsofeng.learningmyfriends.SlideStorage;

import java.util.LinkedList;
/**
 * SlideHistory.java
 * @author Damien Razdan
 * This class contained the main containment method for a slide's edit history, stored primarily through a linked list.
 * From here
 */
public class SlideHistory {
    LinkedList<String> list;


    SlideHistory(){
        this.list = new LinkedList<>();
    }
    //Retrieves a specific element from the linked list.
    public String getElement(int position){
        return this.list.get(position);
    }
    //This adds a new number to the end [back-end] of the sequence.
    // If the linked list is too big, the first element gets popped and the new element is added on top.
    // Since it's a linked list, the list adjusts its index automatically.
    public void add(String history){
        if (this.list.size() > 5){
            this.list.removeFirst();
            this.list.add(history);
        }
        else{
            this.list.add(history);
        }
    }

}

