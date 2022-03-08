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

    /**
     * Checks to see if there's a slide at the specified index.
     * @param slideNumber
     * @return true if there's a slide at the specified index, false otherwise.
     */
    public boolean search(int slideNumber){
        // Log slideNumber compcared to slides.size()
        System.out.println("Searching for slide: " + slideNumber + "of size: " + slides.size());
        if (slideNumber > slides.size() - 1) {
            return false;
        } else {
            return true;
        }
    }

    public void addslide(int slideNumber, String slide){
        // System.out.println("Slide Size: " + slides.size());
        slides.add(new Slide(slideNumber, slide));
    }

    public String getSlide(int slideNum){
        System.out.println("Getting slide " + slideNum + " of " + (this.slides.size() - 1));

        // if (slideNum > slides.size() - 1) { // Commenting this so we can always remember <3

        //     this.addslide(slideNum, "");
        // }

        return slides.get(slideNum).getcurrentSlide();
    }

    public void editslide(int slideNumber, String slide){
        System.out.println("Editing Slide " + slideNumber + " of " + this.slides.size());
        Slide s = slides.get(slideNumber);
        System.out.println("Slide is null: " + (s == null));

        s.newEdit(new Slide(slideNumber, slide));
    }

    public void removeslide(int slide){
        slides.remove(slide);
        for (int i = slide; slides.get(i++) != null; i++){
            slides.add(i, slides.get(i++));
        }
    }

}
