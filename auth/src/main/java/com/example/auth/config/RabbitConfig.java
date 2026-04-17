package com.example.auth.config;

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
    public TopicExchange exchange() {
        return new TopicExchange("user.exchange");
    }

    @Bean
    public Queue blockedQueue() {
        return new Queue("user.blocked.auth.queue");
    }

    @Bean
    public Binding blockedBinding(Queue blockedQueue, TopicExchange exchange) {
        return BindingBuilder
                .bind(blockedQueue)
                .to(exchange)
                .with("user.blocked");
    }

    @Bean
    public Queue unblockedQueue() {
        return new Queue("user.unblocked.auth.queue");
    }

    @Bean
    public Binding unblockedBinding(Queue unblockedQueue, TopicExchange exchange) {
        return BindingBuilder
                .bind(unblockedQueue)
                .to(exchange)
                .with("user.unblocked");
    }

    @Bean
    public JacksonJsonMessageConverter messageConverter() {
        return new JacksonJsonMessageConverter();
    }
}
