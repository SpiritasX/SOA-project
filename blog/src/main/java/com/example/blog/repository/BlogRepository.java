package com.example.blog.repository;

import com.example.blog.model.Blog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogRepository extends MongoRepository<Blog, String> {
    List<Blog> findAllByAuthorId(Long authorId);
    List<Blog> findByAuthorIdIn(List<Long> authorIds);
}
