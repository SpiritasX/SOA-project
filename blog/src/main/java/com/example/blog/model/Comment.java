package com.example.blog.model;

import java.util.Date;

public class Comment {
    private Long authorId;
    private String content;
    private Date createdAt;
    private Date updatedAt;

    public Comment() {
    }

    public Comment(Long authorId, String content) {
        this.authorId = authorId;
        this.content = content;
        this.createdAt = new Date(System.currentTimeMillis());
        this.updatedAt = this.createdAt;
    }

    public Long getAuthorId() {
        return authorId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
        this.updatedAt = new Date(System.currentTimeMillis());
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }
}
