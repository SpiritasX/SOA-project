package com.example.blog.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.*;

@Document(collection = "blogs")
public class Blog {
    @Id
    private String id;
    private User author;
    private String title;
    private String description;
    private Date createdAt;
    private List<String> imagePaths;
    private List<Comment> comments;
    private Set<Long> likes;

    public Blog() {
    }

    public Blog(User author, String title, String description) {
        this.author = author;
        this.title = title;
        this.description = description;
        this.createdAt = new Date(System.currentTimeMillis());
        this.imagePaths = new ArrayList<>();
        this.comments = new ArrayList<>();
        this.likes = new HashSet<>();
    }

    public String getId() {
        return id;
    }

    public User getAuthor() {
        return author;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public List<String> getImagePaths() {
        return imagePaths;
    }

    // TODO replace with uploadImage
    public void setImagePaths(List<String> imagePaths) {
        this.imagePaths = imagePaths;
    }

    public List<Comment> getComments() {
        return comments;
    }

    public void addComment(Comment comment) {
        this.comments.add(comment);
    }

    public Set<Long> getLikes() {
        return likes;
    }

    public boolean like(Long userId) {
        return this.likes.add(userId);
    }

    public boolean unlike(Long userId) {
        return this.likes.remove(userId);
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Blog blog)) return false;
        return Objects.equals(id, blog.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
