package com.example.blog.model;

import jakarta.persistence.*;

import java.sql.Timestamp;
import java.util.*;

@Entity(name = "blogs")
public class Blog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    private User author;
    @Column(nullable = false)
    private String title;
    @Column
    private String description;
    @Column(nullable = false)
    private Timestamp createdAt;
    @Column
    private List<String> imagePaths;
    @OneToMany(mappedBy = "blog", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private Set<Comment> comments;
    @OneToMany(mappedBy = "blog", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private Set<Like> likes;

    public Blog() {
    }

    public Blog(User author, String title, String description) {
        this.author = author;
        this.title = title;
        this.description = description;
        this.createdAt = new Timestamp(System.currentTimeMillis());
        this.imagePaths = new ArrayList<>();
        this.comments = new HashSet<>();
        this.likes = new HashSet<>();
    }

    public Long getId() {
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

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public List<String> getImagePaths() {
        return imagePaths;
    }

    // TODO replace with uploadImage
    public void setImagePaths(List<String> imagePaths) {
        this.imagePaths = imagePaths;
    }

    public Set<Comment> getComments() {
        return comments;
    }

    public void addComment(Comment comment) {
        this.comments.add(comment);
    }

    public Set<Like> getLikes() {
        return likes;
    }

    public boolean like(Like like) {
        return this.likes.add(like);
    }

    public boolean unlike(Like like) {
        return this.likes.remove(like);
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
