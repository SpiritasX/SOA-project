package com.blog.model;

import jakarta.persistence.*;

import java.sql.Timestamp;
import java.util.Objects;

@Entity(name = "comments")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    private User author;
    @ManyToOne(fetch = FetchType.LAZY)
    private Blog blog;
    @Column(nullable = false)
    private String content;
    @Column(nullable = false)
    private Timestamp createdAt;
    @Column(nullable = false)
    private Timestamp updatedAt;

    public Comment() {
    }

    public Comment(User author, Blog blog, String content) {
        this.author = author;
        this.blog = blog;
        this.content = content;
        this.createdAt = new Timestamp(System.currentTimeMillis());
        this.updatedAt = this.createdAt;
    }

    public Long getId() {
        return id;
    }

    public User getAuthor() {
        return author;
    }

    public Blog getBlog() {
        return blog;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
        this.updatedAt = new Timestamp(System.currentTimeMillis());
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public Timestamp getUpdatedAt() {
        return updatedAt;
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Comment comment)) return false;
        return Objects.equals(id, comment.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
