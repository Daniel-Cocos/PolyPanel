package com.example.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/** Configures API CORS access for the dashboard frontend. */
@Configuration
public class WebConfig implements WebMvcConfigurer {

	/** Allows the local Vite app and the deployed dashboard to call backend APIs. */
	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/api/**")
			.allowedOrigins("http://localhost:5173", "http://127.0.0.1:5173", "https://daniel-cocos.github.io")
			.allowedMethods("GET")
			.allowedHeaders("*");
	}
}
