package com.ncfsofeng.learningmyfriends.SlideStorage;

public class Slide implements Comparable<Slide>{
    public int slideNumber;
    public int currentSlide;
    public SlideHistory history = new SlideHistory();

    public Slide(int slideNumber, String newSlide){
        this.slideNumber = slideNumber;
        this.currentSlide = 0;
        this.history.add(newSlide);
    }

    public void newEdit(Slide newSlide){
        this.slideNumber = newSlide.getSlideNumber();
        this.history.add(newSlide.getHistory().getElement(0));
        if (this.currentSlide < 4){
            this.currentSlide++;
        }
    }

    public String undo(){
        if(this.currentSlide != 0){
            this.currentSlide--;
        }
        return this.getcurrentSlide();
    }
    public String redo(){
        if(this.currentSlide != 4){
            this.currentSlide++;
        }
        return this.getcurrentSlide();
    }

    public int getSlideNumber(){
        return this.slideNumber;
    }
    public String getcurrentSlide(){return this.history.getElement(this.currentSlide);}
    public SlideHistory getHistory(){
        return this.history;
    }
    public void setSlideNumber(int newSlideNumber){
        this.slideNumber = newSlideNumber;
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
