package com.example.blog.dto;

import com.example.blog.model.Blog;
import com.example.blog.model.Comment;
import com.example.blog.model.Like;
import com.example.blog.model.User;
import jakarta.persistence.*;

import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Set;

public class SmallBlogDTO {
    private Long id;
    private Long authorId;
    private String title;
    private String description;
    private Timestamp createdAt;
    private Set<CommentDTO> comments;
    private int likes;

    public SmallBlogDTO(Blog blog) {
        this.id = blog.getId();
        this.authorId = blog.getAuthor().getId();
        this.title = blog.getTitle();
        this.description = blog.getDescription();
        this.createdAt = blog.getCreatedAt();
        this.comments = new HashSet<>(blog.getComments().stream().map(CommentDTO::new).toList());
        this.likes = blog.getLikes().size();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getAuthorId() {
        return authorId;
    }

    public void setAuthorId(Long authorId) {
        this.authorId = authorId;
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

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public Set<CommentDTO> getComments() {
        return comments;
    }

    public void setComments(Set<CommentDTO> comments) {
        this.comments = comments;
    }

    public int getLikes() {
        return likes;
    }

    public void setLikes(int likes) {
        this.likes = likes;
    }
}
