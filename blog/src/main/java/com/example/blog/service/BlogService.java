package com.example.blog.service;

import com.example.blog.dto.CreateBlogDTO;
import com.example.blog.dto.SmallBlogDTO;
import com.example.common.exception.BadRequestException;
import com.example.common.exception.ForbiddenException;
import com.example.common.exception.NotFoundException;
import com.example.blog.model.Blog;
import com.example.blog.model.Comment;
import com.example.blog.model.User;
import com.example.blog.repository.BlogRepository;
import com.example.blog.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BlogService {
    private final BlogRepository blogRepository;
    private final UserRepository userRepository;

    public BlogService(BlogRepository blogRepository, UserRepository userRepository) {
        this.blogRepository = blogRepository;
        this.userRepository = userRepository;
    }

    public SmallBlogDTO getBlog(String id) {
        Blog blog = blogRepository.findById(id).orElseThrow(() -> new NotFoundException("Blog not found"));
        return new SmallBlogDTO(blog);
    }

    public List<SmallBlogDTO> getUserBlogs(Long userId) {
        return blogRepository.findAllByAuthorId(userId).stream().map(SmallBlogDTO::new).toList();
    }

    public void createBlog(CreateBlogDTO dto, Long authorId) {
        User user = userRepository.findById(authorId).orElseThrow(() -> new NotFoundException("User not found"));

        if (dto.getTitle() == null || dto.getTitle().isEmpty()) {
            throw new BadRequestException("Invalid blog data");
        }

        Blog blog = new Blog(
                user,
                dto.getTitle(),
                dto.getDescription()
        );

        blogRepository.save(blog);
    }

    public void comment(String blogId, String content, Long authorId) {
        User user = userRepository.findById(authorId).orElseThrow(() -> new NotFoundException("User not found"));

        Blog blog = blogRepository.findById(blogId).orElseThrow(() -> new NotFoundException("Blog not found"));

        Comment comment = new Comment(
                authorId,
                content
        );

        blog.addComment(comment);
        blogRepository.save(blog);
    }

    public void editComment(String blogId, int commentIndex, String content, Long authorId) {
        Blog blog = blogRepository.findById(blogId).orElseThrow(() -> new NotFoundException("Blog not found"));

        if (commentIndex < 0 || commentIndex >= blog.getComments().size()) {
            throw new NotFoundException("Comment not found");
        }

        Comment comment = blog.getComments().get(commentIndex);

        if (!comment.getAuthorId().equals(authorId)) {
            throw new ForbiddenException("You are not the author of this comment");
        }

        comment.setContent(content);
        blogRepository.save(blog);
    }

    public void toggleLikeBlog(String blogId, Long userId) {
        Blog blog = blogRepository.findById(blogId).orElseThrow(() -> new NotFoundException("Blog not found"));

        if (blog.getLikes().contains(userId)) {
            blog.unlike(userId);
        } else {
            blog.like(userId);
        }
        blogRepository.save(blog);
    }

    public List<SmallBlogDTO> getBlogsByUserIds(List<Long> userIds) {
        return blogRepository.findByAuthorIdIn(userIds).stream().map(SmallBlogDTO::new).toList();
    }
}
