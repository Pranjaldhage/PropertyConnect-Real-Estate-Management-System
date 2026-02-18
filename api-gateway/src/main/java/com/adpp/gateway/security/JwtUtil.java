package com.adpp.gateway.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.nio.charset.StandardCharsets;
import java.security.Key;

@Component
public class JwtUtil {

    private static final Logger log =
            LoggerFactory.getLogger(JwtUtil.class);

    /**
     * Secret injected from application.yml / env:
     *
     * jwt.secret=super-long-secret-key
     */
    @Value("${jwt.secret}")
    private String secret;

    private Key key;

    @PostConstruct
    public void init() {
        this.key =
                Keys.hmacShaKeyFor(
                        secret.getBytes(StandardCharsets.UTF_8)
                );
    }

    /**
     * Validates JWT signature & expiry.
     * Throws exception if invalid.
     */
    public Claims validateToken(String token)
            throws JwtException {

        return Jwts.parserBuilder()
                .setSigningKey(key)
                .setAllowedClockSkewSeconds(30)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Extract claim safely
     */
    public String getClaim(Claims claims,
                           String key) {

        Object value = claims.get(key);
        return value != null
                ? value.toString()
                : null;
    }
}
