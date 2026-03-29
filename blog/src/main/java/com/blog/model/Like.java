package com.blog.model;

import jakarta.persistence.*;

import java.util.Objects;

@Entity(name = "likes")
public class Like {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private Long userId;
    @ManyToOne(fetch = FetchType.LAZY)
    private Blog blog;

    public Like() {
    }

    public Like(Long userId, Blog blog) {
        this.userId = userId;
        this.blog = blog;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public Blog getBlog() {
        return blog;
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Like like)) return false;
        return Objects.equals(id, like.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
