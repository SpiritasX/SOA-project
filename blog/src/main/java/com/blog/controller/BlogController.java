package com.blog.controller;

import com.blog.dto.CreateBlogDTO;
import com.blog.service.BlogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/blog")
public class BlogController {
    private final BlogService blogService;

    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    // TODO change param to JWT
    @PostMapping("/create")
    public ResponseEntity<?> createBlog(@RequestBody CreateBlogDTO dto, @RequestParam Long userId) {
        blogService.createBlog(dto, userId);
        return ResponseEntity.ok().build();
    }

    // TODO add image to blog

    // TODO change param to JWT
    @PostMapping("/{blogId}/comment")
    public ResponseEntity<?> comment(@PathVariable Long blogId, @RequestBody String content, @RequestParam Long userId) {
        blogService.comment(blogId, content, userId);
        return ResponseEntity.ok().build();
    }

    // TODO change param to JWT
    @PatchMapping("/comment/{commentId}/edit")
    public ResponseEntity<?> editComment(@PathVariable Long commentId, @RequestBody String content, @RequestParam Long userId) {
        blogService.editComment(commentId, content, userId);
        return ResponseEntity.ok().build();
    }

    // TODO change param to JWT
    @PostMapping("/{blogId}/like")
    public ResponseEntity<?> like(@PathVariable Long blogId, @RequestParam Long userId) {
        blogService.toggleLikeBlog(blogId, userId);
        return ResponseEntity.ok().build();
    }
}
