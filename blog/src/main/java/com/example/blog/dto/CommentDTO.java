package com.example.blog.dto;

import com.example.blog.model.Blog;
import com.example.blog.model.Comment;
import com.example.blog.model.User;
import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToOne;

import java.sql.Timestamp;

public class CommentDTO {
    private Long id;
    private Long authorId;
    private String content;
    private Timestamp createdAt;
    private Timestamp updatedAt;

    public CommentDTO(Comment comment) {
        this.id = comment.getId();
        this.authorId = comment.getAuthor().getId();
        this.content = comment.getContent();
        this.createdAt = comment.getCreatedAt();
        this.updatedAt = comment.getUpdatedAt();
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

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public Timestamp getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Timestamp updatedAt) {
        this.updatedAt = updatedAt;
    }
}
