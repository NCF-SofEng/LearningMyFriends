package com.ncfsofeng.learningmyfriends.SlideStorage;

public class SlideStorage<T extends Comparable> extends DoubleLinked{

    public void insert(T data){
        DNode current = start;
        DNode ended = end;
        DNode new_node = new DNode<T>(data);
        if ((current.getData().compareTo(data) == 0) || (current.getData().compareTo(data) >= 1)){
            new_node.setNext(current);
            start = new_node;
        }
        else if ((end.getData().compareTo(data) == 0) || (end.getData().compareTo(data) <= -1)){
            ended.setNext(new_node);
            new_node.setPrevious(ended);
            end = new_node;
        }
        else{
            for(int i = 0; current.getData().compareTo(data) <= -1; i++){
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

    public boolean remove(T data){
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

    public boolean search(T data){
        DNode current = start;
        if (current.getData().compareTo(data) == 0){
            return true;
        }
        if(end.getData().compareTo(data) == 0){
            return true;
        }
        for (int i = 0; i < this.len - 1; i++){
            if (current.getData().compareTo(data) == 0){
                return true;
            }
            current = current.getNext();
        }
        return false;
    }

}


