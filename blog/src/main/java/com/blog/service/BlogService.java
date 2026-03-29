package com.blog.service;

import com.blog.dto.CreateBlogDTO;
import com.blog.exception.BadRequestException;
import com.blog.exception.ForbiddenException;
import com.blog.exception.NotFoundException;
import com.blog.model.Blog;
import com.blog.model.Comment;
import com.blog.model.Like;
import com.blog.repository.BlogRepository;
import com.blog.repository.CommentRepository;
import com.blog.repository.LikeRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class BlogService {
    private final BlogRepository blogRepository;
    private final CommentRepository commentRepository;
    private final LikeRepository likeRepository;

    public BlogService(BlogRepository blogRepository, CommentRepository commentRepository, LikeRepository likeRepository) {
        this.blogRepository = blogRepository;
        this.commentRepository = commentRepository;
        this.likeRepository = likeRepository;
    }

    public void createBlog(CreateBlogDTO dto, Long authorId) {
        // TODO check for existing author

        if (authorId == null || dto.getTitle() == null || dto.getTitle().isEmpty()) {
            throw new BadRequestException("Invalid blog data");
        }

        Blog blog = new Blog(
                authorId,
                dto.getTitle(),
                dto.getDescription()
        );

        blogRepository.save(blog);
    }

    public void comment(Long blogId, String content, Long authorId) {
        // TODO check for existing author

        Blog blog = blogRepository.findById(blogId).orElseThrow(() -> new NotFoundException("Blog not found"));

        Comment comment = new Comment(
                authorId,
                blog,
                content
        );

        blog.addComment(comment);
        blogRepository.save(blog);
    }

    public void editComment(Long commentId, String content, Long authorId) {
        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new NotFoundException("Comment not found"));

        if (!comment.getAuthorId().equals(authorId)) {
            throw new ForbiddenException("You are not the author of this comment");
        }

        comment.setContent(content);
        commentRepository.save(comment);
    }

    public void toggleLikeBlog(Long blogId, Long userId) {
        Blog blog = blogRepository.findById(blogId).orElseThrow(() -> new NotFoundException("Blog not found"));

        // TODO check for existing user

        // TODO change userId usage to user usage
        Optional<Like> like = likeRepository.findByBlogIdAndUserId(blog.getId(), userId);

        if (like.isPresent()) {
            blog.unlike(like.get());
            likeRepository.delete(like.get());
            blogRepository.save(blog);
        } else {
            // TODO change userId usage to user usage
            blog.like(new Like(userId, blog));
            blogRepository.save(blog);
        }
    }
}
