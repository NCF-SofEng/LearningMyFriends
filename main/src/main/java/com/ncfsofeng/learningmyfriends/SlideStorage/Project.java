package com.ncfsofeng.learningmyfriends.SlideStorage;

public class Project {
    public String projectName = "Unnamed Project";
    public SlideStorage Slides= new SlideStorage();

    public void Project(){

    }

    public void addSlide(String slide){
        Slides.insert(new Slide(Slides.getSize(), slide));
    }

}
