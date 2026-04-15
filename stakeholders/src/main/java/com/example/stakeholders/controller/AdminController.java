package com.example.stakeholders.controller;

import com.example.stakeholders.dto.DetailViewDTO;
import com.example.stakeholders.dto.ListViewDTO;
import com.example.stakeholders.service.AdminService;
import com.example.stakeholders.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final UserService userService;
    private final AdminService adminService;

    public AdminController(UserService userService, AdminService adminService) {
        this.userService = userService;
        this.adminService = adminService;
    }

    @GetMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<DetailViewDTO> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUser(id));
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<Page<ListViewDTO>> getUsers(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(userService.getUsers(page, size));
    }

    @PatchMapping("/users/{id}/block")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<?> blockUser(@PathVariable Long id) {
        adminService.blockUser(id);

        return ResponseEntity.ok("Blocked user with id: " + id);
    }

    @PatchMapping("/users/{id}/unblock")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<?> unblockUser(@PathVariable Long id) {
        adminService.unblockUser(id);

        return ResponseEntity.ok("Unblocked user with id: " + id);
    }
}
