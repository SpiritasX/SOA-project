package com.example.tour.config;

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
    public Queue registeredQueue() {
        return new Queue("user.registered.tour.queue");
    }

    @Bean
    public Binding registeredBinding(Queue registeredQueue, TopicExchange exchange) {
        return BindingBuilder
                .bind(registeredQueue)
                .to(exchange)
                .with("user.registered");
    }

    @Bean
    public JacksonJsonMessageConverter messageConverter() {
        return new JacksonJsonMessageConverter();
    }
}
