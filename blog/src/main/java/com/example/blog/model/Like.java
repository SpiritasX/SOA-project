package com.example.blog.model;

import jakarta.persistence.*;

import java.util.Objects;

@Entity(name = "likes")
public class Like {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    private User user;
    @ManyToOne(fetch = FetchType.LAZY)
    private Blog blog;

    public Like() {
    }

    public Like(User user, Blog blog) {
        this.user = user;
        this.blog = blog;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
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
