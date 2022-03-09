package com.ncfsofeng.learningmyfriends.SlideStorage;

import javax.swing.*;
import java.awt.*;
import java.util.Scanner;
import java.io.*;
import java.nio.Buffer;
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

    public void save() {
        try{


                JFrame parentFrame = new JFrame();
                JFileChooser fileChooser = new JFileChooser();
                fileChooser.setDialogTitle("Specify a file to save");
                int userSelection = fileChooser.showSaveDialog(parentFrame);
                File fileToSave;
                if (userSelection == JFileChooser.APPROVE_OPTION) {
                    fileToSave = fileChooser.getSelectedFile();
                    System.out.println("Save as file: " + fileToSave.getAbsolutePath());
                    FileWriter writer = new FileWriter(fileToSave);
                    for (int i = 0; i < slides.size(); i++) {
                        writer.append(Integer.toString(slides.get(i).getSlideNumber()) + "|==|" + slides.get(i).getcurrentSlide() + "\\");
                    }
                    writer.close();
                }
        }
        catch(IOException e){System.out.println("Error while writing to file");}
    }

    public String undo(int slideNum){
        return slides.get(slideNum).undo();
    }

    public String redo(int slideNum){
        return slides.get(slideNum).redo();
    }

    public void load(File savedProject){
        try{
            String[] savedName= savedProject.getName().split(".");
            this.projectName = savedName[0];
            Scanner scanner = new Scanner(savedProject);
            String[] currentSlide;
            while (scanner.hasNextLine()) {
                currentSlide =  scanner.nextLine().split("|==|");
                this.addslide(Integer.parseInt(currentSlide[0]), currentSlide[1]);
            }
            scanner.close();
        }
        catch(IOException e){System.out.println("Error while reading file");}
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