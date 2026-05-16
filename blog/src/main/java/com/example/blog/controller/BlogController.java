package com.example.blog.controller;

import com.example.blog.dto.CreateBlogDTO;
import com.example.common.security.UserPrincipal;
import com.example.blog.service.BlogService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/blog")
public class BlogController {
    private final BlogService blogService;

    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    @GetMapping("/{blogId:\\d+}")
    public ResponseEntity<?> getBlog(@PathVariable Long blogId) {
        return ResponseEntity.ok(blogService.getBlog(blogId));
    }

    @PostMapping("/by-user-ids")
    public ResponseEntity<?> getBlogsByUserIds(Authentication authentication, @RequestBody List<Long> userIds) {
        return ResponseEntity.ok(blogService.getBlogsByUserIds(userIds));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyBlogs(Authentication authentication) {
        UserPrincipal user = (UserPrincipal) Objects.requireNonNull(authentication.getPrincipal());

        return ResponseEntity.ok(blogService.getUserBlogs(user.getId()));
    }

    @PostMapping("/create")
    public ResponseEntity<?> createBlog(Authentication authentication, @RequestBody CreateBlogDTO dto) {
        UserPrincipal user = (UserPrincipal) Objects.requireNonNull(authentication.getPrincipal());
        blogService.createBlog(dto, user.getId());
        return ResponseEntity.ok().build();
    }

    // TODO add image to blog

    @PostMapping("/{blogId}/comment")
    public ResponseEntity<?> comment(Authentication authentication, @PathVariable Long blogId, @RequestBody String content) {
        UserPrincipal user = (UserPrincipal) Objects.requireNonNull(authentication.getPrincipal());
        blogService.comment(blogId, content, user.getId());
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/comment/{commentId}/edit")
    public ResponseEntity<?> editComment(Authentication authentication, @PathVariable Long commentId, @RequestBody String content) {
        UserPrincipal user = (UserPrincipal) Objects.requireNonNull(authentication.getPrincipal());
        blogService.editComment(commentId, content, user.getId());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{blogId}/like")
    public ResponseEntity<?> like(Authentication authentication, @PathVariable Long blogId) {
        UserPrincipal user = (UserPrincipal) Objects.requireNonNull(authentication.getPrincipal());
        blogService.toggleLikeBlog(blogId, user.getId());
        return ResponseEntity.ok().build();
    }
}
