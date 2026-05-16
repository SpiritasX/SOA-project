package com.example.blog.repository;

import com.example.blog.model.Blog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {
    List<Blog> findAllByAuthorId(Long authorId);
    List<Blog> findByAuthorIdIn(List<Long> authorIds);
}
