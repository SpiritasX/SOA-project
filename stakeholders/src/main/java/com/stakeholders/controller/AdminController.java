package com.stakeholders.controller;

import com.stakeholders.dto.DetailViewDTO;
import com.stakeholders.dto.ListViewDTO;
import com.stakeholders.service.AdminService;
import com.stakeholders.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    // TODO remove param and use JWT
    @GetMapping("/users/{id}")
//    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<DetailViewDTO> getUser(@RequestParam String role, @PathVariable Long id) {
        if (!role.equals("ADMINISTRATOR")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        return ResponseEntity.ok(userService.getUser(id));
    }

    // TODO remove param and use JWT
    @GetMapping("/users")
//    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity<Page<ListViewDTO>> getUsers(@RequestParam String role, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        if (!role.equals("ADMINISTRATOR")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        return ResponseEntity.ok(userService.getUsers(page, size));
    }

    // TODO remove param and use JWT
    @PatchMapping("/users/{id}/block")
    public ResponseEntity<?> blockUser(@RequestParam String role, @PathVariable Long id) {
        if (!role.equals("ADMINISTRATOR")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Must be administrator");
        }

        adminService.blockUser(id);

        return ResponseEntity.ok("Blocked user with id: " + id);
    }

    // TODO remove param and use JWT
    @PatchMapping("/users/{id}/unblock")
    public ResponseEntity<?> unblockUser(@RequestParam String role, @PathVariable Long id) {
        if (!role.equals("ADMINISTRATOR")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Must be administrator");
        }

        adminService.unblockUser(id);

        return ResponseEntity.ok("Unblocked user with id: " + id);
    }
}
