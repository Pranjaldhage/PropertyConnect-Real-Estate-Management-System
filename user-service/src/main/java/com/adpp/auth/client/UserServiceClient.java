package com.adpp.auth.client;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class UserServiceClient {

    private final RestTemplate restTemplate = new RestTemplate();

    private final String USER_SERVICE_URL =
            "http://localhost:8086/users/profile";

    public void createProfile(Long userId, String email) {

        var body = new java.util.HashMap<String, Object>();
        body.put("email", email);
        body.put("fullName", "");
        body.put("phone", "");

        var headers = new org.springframework.http.HttpHeaders();
        headers.set("X-USER-ID", userId.toString());

        var entity =
                new org.springframework.http.HttpEntity<>(body, headers);

        restTemplate.postForEntity(USER_SERVICE_URL, entity, Void.class);
    }
}
