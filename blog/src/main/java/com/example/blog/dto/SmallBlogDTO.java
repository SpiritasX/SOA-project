package com.example.blog.dto;

import com.example.blog.model.Blog;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class SmallBlogDTO {
    private String id;
    private Long authorId;
    private String title;
    private String description;
    private Date createdAt;
    private List<CommentDTO> comments;
    private int likes;

    public SmallBlogDTO(Blog blog) {
        this.id = blog.getId();
        this.authorId = blog.getAuthor().getId();
        this.title = blog.getTitle();
        this.description = blog.getDescription();
        this.createdAt = blog.getCreatedAt();
        this.comments = new ArrayList<>(blog.getComments().stream().map(CommentDTO::new).toList());
        for (int i = 0; i < this.comments.size(); i++)
            this.comments.get(i).setId((long) i);
        this.likes = blog.getLikes().size();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Long getAuthorId() {
        return authorId;
    }

    public void setAuthorId(Long authorId) {
        this.authorId = authorId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public List<CommentDTO> getComments() {
        return comments;
    }

    public void setComments(List<CommentDTO> comments) {
        this.comments = comments;
    }

    public int getLikes() {
        return likes;
    }

    public void setLikes(int likes) {
        this.likes = likes;
    }
}
