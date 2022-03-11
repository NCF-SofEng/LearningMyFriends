package com.ncfsofeng.learningmyfriends.SlideStorage;

import com.aspose.pdf.Document;
import com.aspose.pdf.Page;
import com.aspose.pdf.Image;
import javax.imageio.ImageIO;
import javax.swing.*;
import java.awt.image.BufferedImage;
import java.util.Scanner;
import java.io.*;
import java.util.ArrayList;
import java.util.regex.Pattern;
/**
 * Project.java
 * @author Damien Razdan
 *
 */
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
        if (slideNumber > slides.size() - 1) {
            return false;
        } else {
            return true;
        }
    }

    public void export(String slides){
        String[] splits = slides.split("\\|==\\|");
        // firstImg is a base64 string. Convert it to an image.
        BufferedImage[] Imagesinreadyform = new BufferedImage[splits.length];
        try {
            for (int i = 0; i < splits.length; i++) {
                byte[] imageBytes = java.util.Base64.getMimeDecoder().decode(splits[i].trim());
                Imagesinreadyform[i] = ImageIO.read(new ByteArrayInputStream(imageBytes));
            }
        }
        catch(Exception e){}
        JFrame parentFrame = new JFrame();
        JFileChooser fileChooser = new JFileChooser();
        fileChooser.setDialogTitle("Specify a file to save");
        int userSelection = fileChooser.showSaveDialog(parentFrame);
        if (userSelection == JFileChooser.APPROVE_OPTION) {
            Document doc = new Document();
            for (int j = 0; j < Imagesinreadyform.length; j++) {
                // Add a page to pages collection of document
                Page page = doc.getPages().add();
                // Load the source image file to Stream object

                Image exported = new Image();

                exported.setBufferedImage(Imagesinreadyform[j]);


                // Add the image into paragraphs collection of the section
                page.getParagraphs().add(exported);
            }

            doc.save(fileChooser.getSelectedFile().getAbsolutePath() + ".pdf");
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
                    FileWriter writer = new FileWriter(fileToSave);
                    for (int i = 0; i < slides.size(); i++) {
                        if ((i + 1) >= slides.size()){
                            writer.append(Integer.toString(slides.get(i).getSlideNumber()) + "||==||" + slides.get(i).getcurrentSlide());
                        }
                        else{writer.append(Integer.toString(slides.get(i).getSlideNumber()) + "||==||" + slides.get(i).getcurrentSlide() + "\n");}
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

    public void load(String savedProject){
            Scanner scanner = new Scanner(savedProject);
            String[] currentSlide;
            while (scanner.hasNextLine()) {
                currentSlide =  scanner.nextLine().split(Pattern.quote("||==||"));
                if((this.search(Integer.parseInt(currentSlide[0])) == false)){
                    this.addslide(Integer.parseInt(currentSlide[0]), currentSlide[1]);
                }
                else{this.editslide(Integer.parseInt(currentSlide[0]), currentSlide[1]);}
            }
            scanner.close();
    }

    public void addslide(int slideNumber, String slide){
        // System.out.println("Slide Size: " + slides.size());
        slides.add(new Slide(slideNumber, slide));
    }

    public String getSlide(int slideNum){

        // if (slideNum > slides.size() - 1) { // Commenting this so we can always remember <3

        //     this.addslide(slideNum, "");
        // }

        return slides.get(slideNum).getcurrentSlide();
    }

    public void editslide(int slideNumber, String slide){
        Slide s = slides.get(slideNumber);
        s.newEdit(new Slide(slideNumber, slide));
    }

}