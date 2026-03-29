package com.blog.dto;

public class CreateBlogDTO {
    private String title;
    private String description;

    public CreateBlogDTO() {
    }

    public CreateBlogDTO(String title, String description) {
        this.title = title;
        this.description = description;
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
}
