package com.blog.service;

import com.blog.dto.CreateBlogDTO;
import com.blog.exception.BadRequestException;
import com.blog.exception.ForbiddenException;
import com.blog.exception.NotFoundException;
import com.blog.model.Blog;
import com.blog.model.Comment;
import com.blog.model.Like;
import com.blog.model.User;
import com.blog.repository.BlogRepository;
import com.blog.repository.CommentRepository;
import com.blog.repository.LikeRepository;
import com.blog.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class BlogService {
    private final BlogRepository blogRepository;
    private final CommentRepository commentRepository;
    private final LikeRepository likeRepository;
    private final UserRepository userRepository;

    public BlogService(BlogRepository blogRepository, CommentRepository commentRepository, LikeRepository likeRepository, UserRepository userRepository) {
        this.blogRepository = blogRepository;
        this.commentRepository = commentRepository;
        this.likeRepository = likeRepository;
        this.userRepository = userRepository;
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

    public void comment(Long blogId, String content, Long authorId) {
        User user = userRepository.findById(authorId).orElseThrow(() -> new NotFoundException("User not found"));

        Blog blog = blogRepository.findById(blogId).orElseThrow(() -> new NotFoundException("Blog not found"));

        Comment comment = new Comment(
                user,
                blog,
                content
        );

        blog.addComment(comment);
        blogRepository.save(blog);
    }

    public void editComment(Long commentId, String content, Long authorId) {
        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new NotFoundException("Comment not found"));

        if (!comment.getAuthor().getId().equals(authorId)) {
            throw new ForbiddenException("You are not the author of this comment");
        }

        comment.setContent(content);
        commentRepository.save(comment);
    }

    public void toggleLikeBlog(Long blogId, Long userId) {
        Blog blog = blogRepository.findById(blogId).orElseThrow(() -> new NotFoundException("Blog not found"));

        User user = userRepository.findById(userId).orElseThrow(() -> new NotFoundException("User not found"));

        Optional<Like> like = likeRepository.findByBlogIdAndUserId(blog.getId(), user.getId());

        if (like.isPresent()) {
            blog.unlike(like.get());
            likeRepository.delete(like.get());
            blogRepository.save(blog);
        } else {
            // TODO change userId usage to user usage
            blog.like(new Like(user, blog));
            blogRepository.save(blog);
        }
    }
}
