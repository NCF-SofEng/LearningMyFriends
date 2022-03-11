package com.ncfsofeng.learningmyfriends.SlideStorage;

/**
 * Slide.java
 * @author Damien Razdan
 * Class for slide objects. Slides store their number, their slide history for undoing and redoing actions on the frontend, and the current saved slide within said history.
 */

public class Slide implements Comparable<Slide>{
    public int slideNumber;
    public int currentSlide;
    public SlideHistory history = new SlideHistory();

    public Slide(int slideNumber, String newSlide){
        this.slideNumber = slideNumber;
        this.currentSlide = 0;
        this.history.add(newSlide);
    }
    //Makes an edit to an existing slide's history and sets the current slide to the new edit.
    public void newEdit(Slide newSlide){
        this.slideNumber = newSlide.getSlideNumber();
        this.history.add(newSlide.getHistory().getElement(0));
        if (this.currentSlide < 5){
            this.currentSlide++;
        }
    }
    //Access's a previous slide state in order to undo a mistake.
    public String undo(){
        if(this.currentSlide != 0){
            this.currentSlide = this.currentSlide - 2;
        }
        return this.getcurrentSlide();
    }
    //access's a slide state after an undo in case undo was a mistake
    public String redo(){
        if(this.currentSlide != 5){
            this.currentSlide = this.currentSlide + 2;
        }
        return this.getcurrentSlide();
    }
    //getter and setter functions, though get current slides returns the slide elements instead of the int used to index slide elements.
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

    //comparator for slides. Unused but could be useful down the line.
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
