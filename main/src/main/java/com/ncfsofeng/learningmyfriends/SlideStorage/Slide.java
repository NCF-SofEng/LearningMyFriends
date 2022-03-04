package com.ncfsofeng.learningmyfriends.SlideStorage;

public class Slide implements Comparable<Slide>{
    public int slideNumber;
    public int currentSlide;
    public SlideHistory history = new SlideHistory();

    public Slide(int slideNumber, String newSlide){
        this.slideNumber = slideNumber;
        this.currentSlide = 0;
        history.add(newSlide);
    }

    public int getSlideNumber(){
        return this.slideNumber;
    }
    public int getcurrentSlide(){
        return this.currentSlide;
    }
    public SlideHistory getHistory(){
        return this.history;
    }
    public void setSlideNumber(int newSlideNumber){
        this.slideNumber = newSlideNumber;
    }
    public void setcurrentSlide(int newSlide){
        this.currentSlide = newSlide;
    }


    public int compareTo(Slide secondSlide){
        if(this.slideNumber == secondSlide.getSlideNumber()){
            return 0;
        }
        else if(this.slideNumber > secondSlide.getSlideNumber()){
            return 1;
        }
        else{return 0;}
    }

}
