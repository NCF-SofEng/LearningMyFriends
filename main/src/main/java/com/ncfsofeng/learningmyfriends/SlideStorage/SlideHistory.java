package com.ncfsofeng.learningmyfriends.SlideStorage;

import java.util.LinkedList;

public class SlideHistory {
    LinkedList<String> list;


    SlideHistory(){
        this.list = new LinkedList<>();
    }

    public String getElement(int position){
        return this.list.get(position);
    }
    //This adds a new number to the end [back-end] of the sequence
    public void add(String history){
        if (this.list.size() > 4){
            this.list.removeFirst();
            this.list.add(history);
        }
        else{
            this.list.add(history);
        }
    }

}

