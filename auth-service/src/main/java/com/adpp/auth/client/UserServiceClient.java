package com.adpp.auth.client;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Component
public class UserServiceClient {

    private final RestTemplate restTemplate = new RestTemplate();

    // ✅ CALL USER-SERVICE DIRECTLY (internal)
    private static final String USER_SERVICE_URL =
            "http://localhost:8083/users/profile";

    /**
     * Auto-create empty profile after registration
     */
    public void createProfile(Long userId) {

        Map<String, Object> body = new HashMap<>();
        body.put("fullName", "");
        body.put("phone", "");
        body.put("gender", "UNKNOWN");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // internal trust header
        headers.set("X-USER-ID", userId.toString());

        HttpEntity<Map<String, Object>> entity =
                new HttpEntity<>(body, headers);

        restTemplate.postForEntity(
                USER_SERVICE_URL,
                entity,
                Void.class
        );
    }
}
