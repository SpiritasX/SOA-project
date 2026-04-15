package com.example.blog.model;

import com.example.common.model.Role;
import com.example.common.model.Status;
import jakarta.persistence.*;

import java.util.Objects;

@Entity(name = "users")
public class User {
    @Id
    private Long id;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Role role;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status;

    public User() {
    }

    public User(Long id, Role role) {
        this.id = id;
        this.role = role;
        this.status = Status.ACTIVE;
    }

    public Long getId() {
        return id;
    }

    public Role getRole() {
        return role;
    }

    public Status getStatus() {
        return status;
    }

    public void block() {
        this.status = Status.BLOCKED;
    }

    public void unblock() {
        this.status = Status.ACTIVE;
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof User user)) return false;
        return Objects.equals(id, user.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
