package com.ncfsofeng.learningmyfriends.SlideStorage;

public class SlideHistory {
    String[] list;


    SlideHistory(){
        this.list = new String[5];
        for (int i = 0; i < this.list.length; i++){
            this.list[i] = "";
        }
    }

    public String getElement(int position){
        return this.list[position];
    }

    public boolean isEmpty(){
        for (int i = 0; i < this.list.length; i++){
            if(this.list[i] != ""){
                return false;
            }
        }
        return true;
    }


    public void resize(){
        for(int i = 0; i < this.list.length - 1; i++){
            this.list[i] = this.list[i + 1];
            this.list[4] = "";
        }
    }

    //This adds a new number to the end [back-end] of the sequence
    public void add(String history){
        if ((!this.list[this.list.length - 1].equals("")) && (!this.list[0].equals(""))){
            resize();
        }
        for(int i = 0; i < this.list.length; i++){
            if(this.list[i] == ""){
                this.list[i] = history;
                break;
            }
        }


    }

}

