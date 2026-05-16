package com.example.stakeholders.controller;

import com.example.common.security.UserPrincipal;
import com.example.stakeholders.dto.UpdateDTO;
import com.example.stakeholders.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<?> getProfile(Authentication authentication) {
        UserPrincipal user = (UserPrincipal) Objects.requireNonNull(authentication.getPrincipal());
        return ResponseEntity.ok(userService.getUser(user.getId()));
    }

    @PatchMapping
    public ResponseEntity<?> updateProfile(Authentication authentication, @RequestBody UpdateDTO dto) {
        UserPrincipal user = (UserPrincipal) Objects.requireNonNull(authentication.getPrincipal());

        userService.updateUser(user.getId(), dto);

        return ResponseEntity.ok("User updated");
    }

    @GetMapping("/{id:\\d+}")
    public ResponseEntity<?> getUser(Authentication authentication, @PathVariable Long id) {
        return ResponseEntity.ok(userService.getUser(id));
    }

    @PostMapping("/batch")
    public ResponseEntity<?> getUsersBatch(Authentication authentication, @RequestBody List<Long> ids) {
        return ResponseEntity.ok(userService.getUsersByIds(ids));
    }
}
