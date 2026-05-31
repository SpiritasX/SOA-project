package com.example.purchase.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.JacksonJsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {
    @Bean
    public TopicExchange userExchange() {
        return new TopicExchange("user.exchange");
    }

    @Bean
    public TopicExchange tourExchange() {
        return new TopicExchange("tour.exchange");
    }

    @Bean
    public TopicExchange orderExchange() {
        return new TopicExchange("order.exchange");
    }

    @Bean
    public Queue validatedQueue() {
        return new Queue("order.validated.purchase.queue");
    }

    @Bean
    public Binding validatedBinding(Queue validatedQueue, TopicExchange orderExchange) {
        return BindingBuilder
                .bind(validatedQueue)
                .to(orderExchange)
                .with("order.validated");
    }

    @Bean
    public Queue registeredQueue() {
        return new Queue("user.registered.purchase.queue");
    }

    @Bean
    public Binding registeredBinding(Queue registeredQueue, TopicExchange userExchange) {
        return BindingBuilder
                .bind(registeredQueue)
                .to(userExchange)
                .with("user.registered");
    }

    @Bean
    public Queue blockedQueue() {
        return new Queue("user.blocked.purchase.queue");
    }

    @Bean
    public Binding blockedBinding(Queue blockedQueue, TopicExchange userExchange) {
        return BindingBuilder
                .bind(blockedQueue)
                .to(userExchange)
                .with("user.blocked");
    }

    @Bean
    public Queue unblockedQueue() {
        return new Queue("user.unblocked.purchase.queue");
    }

    @Bean
    public Binding unblockedBinding(Queue unblockedQueue, TopicExchange userExchange) {
        return BindingBuilder
                .bind(unblockedQueue)
                .to(userExchange)
                .with("user.unblocked");
    }

    @Bean
    public Queue createdQueue() {
        return new Queue("tour.created.purchase.queue");
    }

    @Bean
    public Binding createdBinding(Queue createdQueue, TopicExchange tourExchange) {
        return BindingBuilder
                .bind(createdQueue)
                .to(tourExchange)
                .with("tour.created");
    }

    @Bean
    public Queue updatedQueue() {
        return new Queue("tour.updated.purchase.queue");
    }

    @Bean
    public Binding updatedBinding(Queue updatedQueue, TopicExchange tourExchange) {
        return BindingBuilder
                .bind(updatedQueue)
                .to(tourExchange)
                .with("tour.updated");
    }

    @Bean
    public Queue publishedQueue() {
        return new Queue("tour.published.purchase.queue");
    }

    @Bean
    public Binding publishedBinding(Queue publishedQueue, TopicExchange tourExchange) {
        return BindingBuilder
                .bind(publishedQueue)
                .to(tourExchange)
                .with("tour.published");
    }

    @Bean
    public Queue archivedQueue() {
        return new Queue("tour.archived.purchase.queue");
    }

    @Bean
    public Binding archivedBinding(Queue archivedQueue, TopicExchange tourExchange) {
        return BindingBuilder
                .bind(archivedQueue)
                .to(tourExchange)
                .with("tour.archived");
    }

    @Bean
    public JacksonJsonMessageConverter messageConverter() {
        return new JacksonJsonMessageConverter();
    }
}

