package com.stakeholders.controller;

import com.stakeholders.dto.UpdateDTO;
import com.stakeholders.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // TODO remove path variable and use JWT
    @GetMapping("/{id}")
    public ResponseEntity<?> getProfile(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUser(id));
    }

    // TODO remove path variable and use JWT
    @PatchMapping("/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody UpdateDTO dto) {
        userService.updateUser(id, dto);

        return ResponseEntity.ok("User updated");
    }
}
