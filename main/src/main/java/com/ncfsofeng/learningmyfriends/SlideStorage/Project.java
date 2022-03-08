package com.ncfsofeng.learningmyfriends.SlideStorage;

public class Project {
    public String projectName = "Unnamed Project";
    public SlideStorage Slides= new SlideStorage();
    public static Project instance = new Project();

    private Project(){

    }

    public String getProjectName(){
        return this.projectName;
    }
    public SlideStorage getSlides(){
        return this.Slides;
    }

    public void setProjectName(String newName){
        this.projectName = newName;
    }

    public static Project getInstance(){
        return instance;
    }

    public void addSlide(int slideNumber, String slide){
        Slides.insert(new Slide(slideNumber, slide));
    }

    public boolean editSlide(int slideNumber, String slide){
        return Slides.editSlide(new Slide(slideNumber, slide));
    }

    public void removeSlide(int slideNumber, String slide){
        Slides.remove(new Slide(slideNumber, slide));
    }

}
