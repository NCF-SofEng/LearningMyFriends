package com.ncfsofeng.learningmyfriends.SlideStorage;

public class SlideHistory {
    String[] list;


    SlideHistory(){
        this.list = new String[5];
        for (int i = 0; i < this.list.length; i++){
            this.list[i] = null;
        }
    }

    public boolean isEmpty(){
        for (int i = 0; i < this.list.length; i++){
            if(this.list[i] != null){
                return false;
            }
        }
        return true;
    }


    public void resize(){
        for(int i = 0; i < this.list.length - 1; i++){
            this.list[i] = this.list[i + 1];
            this.list[4] = null;
        }
    }

    //This adds a new number to the end [back-end] of the sequence
    public void add(String history){
        if ((this.list[this.list.length - 1] != null) && (this.list[0] != null)){
            resize();
        }
        for(int i = 0; i < this.list.length; i++){
            if(this.list[i] == null){
                this.list[i] = history;
                break;
            }
        }


    }

}

