package com.example.backend.api.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE    = "mode.exchange";
    public static final String ROUTING_KEY = "mode.routingkey";
    public static final String QUEUE       = "mode.queue";

    @Bean
    public Queue modeQueue() {
        return new Queue(QUEUE, true); // durable = true
    }

    @Bean
    public DirectExchange modeExchange() {
        return new DirectExchange(EXCHANGE);
    }

    @Bean
    public Binding binding(Queue modeQueue,
                           DirectExchange modeExchange) {
        return BindingBuilder
                .bind(modeQueue)
                .to(modeExchange)
                .with(ROUTING_KEY);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(
            ConnectionFactory connectionFactory) {
        RabbitTemplate template =
                new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter());
        return template;
    }
}
