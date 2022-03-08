package com.ncfsofeng.learningmyfriends.SlideStorage;

import java.sql.Array;
import java.util.ArrayList;

public class Project {
    public String projectName = "Unnamed Project";
    public static Project instance = new Project();
    public ArrayList<Slide> slides= new ArrayList<Slide>();

    private Project(){}

    public String getProjectName(){
        return this.projectName;
    }

    public void setProjectName(String newName){
        this.projectName = newName;
    }

    public static Project getInstance(){
        return instance;
    }

    public boolean search(int slideNumber){
        if (slides.get(slideNumber) != null){
            return true;
        }
        else {return false;}
    }

    public void addslide(int slideNumber, String slide){
        slides.add(slideNumber, new Slide(slideNumber, slide));
    }

    public String getSlide(int slideNum){
        if (slideNum > slides.size()){
            this.addslide(slideNum, "");
        }
        return slides.get(slideNum).getcurrentSlide();
    }

    public void editslide(int slideNumber, String slide){
        slides.get(slideNumber).newEdit(new Slide(slideNumber, slide));
    }

    public void removeslide(int slide){
        slides.remove(slide);
        for (int i = slide; slides.get(i++) != null; i++){
            slides.add(i, slides.get(i++));
        }
    }

}
