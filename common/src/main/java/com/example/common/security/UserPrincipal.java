package com.example.common.security;

import com.example.common.model.Role;

public class UserPrincipal {
    private Long id;
    private Role role;

    public UserPrincipal(Long id, Role role) {
        this.id = id;
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
