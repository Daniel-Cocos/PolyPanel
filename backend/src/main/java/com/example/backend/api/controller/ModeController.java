package com.example.backend.api.controller;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/API")
public class ModeController {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @GetMapping("/mode/{id}")
    public ResponseEntity<Map<String, Object>> setMode(
            @PathVariable int id) {

        // Validate: only 0, 1, 2 are accepted
        if (id < 0 || id > 2) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Invalid mode");
            error.put("message", "ID must be 0, 1, or 2");
            return ResponseEntity
                    .badRequest()
                    .body(error);
        }

        // Build the message as a HashMap
        Map<String, Object> message = new HashMap<>();
        message.put("mode", id);

        // Send to RabbitMQ
        rabbitTemplate.convertAndSend(
            "mode.exchange",
            "mode.routingkey",
            message
        );

        // Build response
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Mode set to " + id);
        response.put("data", message);

        return ResponseEntity.ok(response);
    }
}
