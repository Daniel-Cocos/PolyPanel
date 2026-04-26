package com.example.backend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** Registers JSON infrastructure required by backend API services. */
@Configuration
public class JacksonConfig {

	/** Provides the shared JSON mapper used by API services. */
	@Bean
	ObjectMapper objectMapper() {
		return new ObjectMapper();
	}
}
