package com.ncfsofeng.learningmyfriends.SlideStorage;

public class SlideStorage extends DoubleLinked{

    public void insert(Slide data){
        DNode current = start;
        DNode ended = end;
        DNode new_node = new DNode(data);
        if (ended == null){
            System.out.println("Added slide: " + data.getSlideNumber());
            this.append(data);
        }
        else if (current.getData().getSlideNumber() > data.getSlideNumber()){
            System.out.println("Added slide: " + data.getSlideNumber());
            new_node.setNext(current);
            start = new_node;
        }
        else if (ended.getData().getSlideNumber() < data.getSlideNumber()){
            System.out.println("Added slide: " + data.getSlideNumber());
            ended.setNext(new_node);
            new_node.setPrevious(ended);
            end = new_node;
        }
        else{
            System.out.println("Added slide: " + data.getSlideNumber());
            for(int i = 0; current.getData().getSlideNumber() > data.getSlideNumber(); i++){
                current = current.getNext();
            }
            DNode new_prev = current.getPrevious();
            new_node.setNext(current);
            new_node.setPrevious(new_prev);
            new_prev.setNext(new_node);
            current.setPrevious(new_node);
        }
        this.len++;
    }

    public boolean remove(Slide data){
        DNode current = start;
        DNode ended = end;
        if (current.getData().compareTo(data) == 0){
            start = current.getNext();
            this.len--;
            return true;
        }
        if(ended.getData().compareTo(data) == 0){
            end = ended.getPrevious();
            end.setNext(null);
            end.setPrevious(ended.getPrevious().getPrevious());
            this.len--;
            return true;
        }
        for (int i = 0; i < this.len - 1; i++){
            if (current.getNext().getData().compareTo(data) == 0){
                DNode previous = current.getNext().getNext();
                previous.setPrevious(current);
                current.setNext(previous);
                len--;
                return true;
            }
            current = current.getNext();
        }
        return false;
    }

    public boolean editSlide(Slide data){
        DNode current = start;
        if (current == null){
            return false;
        }
        else if (current.getData().compareTo(data) == 0){
            current.getData().newEdit(data);
            return true;
        }
        else if(end.getData().compareTo(data) == 0){
            end.getData().newEdit(data);
            return true;
        }
        else {
            for (int i = 0; i < this.len - 1; i++) {
                if (current.getData().compareTo(data) == 0) {
                    current.getData().newEdit(data);
                    return true;
                }
                current = current.getNext();
            }
        }
        return false;
    }

    public String retrieveSlide(int data){
        DNode current = start;
        //System.out.println("Comparative slide: " + current.getData().getSlideNumber());
        if (current.getData().getSlideNumber() == data){
            return current.getData().getcurrentSlide();
        }
        //System.out.println(end.getData().getSlideNumber());
        //System.out.println(start.getData().getSlideNumber());
        if(end.getData().getSlideNumber() == data){
            return end.getData().getcurrentSlide();
        }
        for (int i = 0; i < this.len - 1; i++){
            if (current.getData().getSlideNumber() == data){
                return current.getData().getcurrentSlide();
            }
            current = current.getNext();
        }
        return "";
    }

}


