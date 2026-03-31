package com.stakeholders.model;

import com.stakeholders.exception.ForbiddenException;
import jakarta.persistence.*;

import java.util.Objects;

@Entity(name = "users")
public class User {
    @Id
    private Long id;
    @Column(nullable = false)
    private String firstName;
    @Column(nullable = false)
    private String lastName;
    @Column
    private String profileImagePath;
    @Column
    private String bio;
    @Column
    private String motto;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Role role;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status;

    public User() {
    }

    public User(Long id, String firstName, String lastName, Role role) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.status = Status.ACTIVE;
    }

    public Long getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getProfileImagePath() {
        return profileImagePath;
    }

    public void setProfileImagePath(String profileImagePath) {
        this.profileImagePath = profileImagePath;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getMotto() {
        return motto;
    }

    public void setMotto(String motto) {
        this.motto = motto;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        if (role.equals(Role.ADMINISTRATOR)) {
            throw new ForbiddenException("You're not allowed to set the role as administrator");
        }

        this.role = role;
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
