package com.adpp.gateway.filter;

import java.nio.charset.StandardCharsets;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import com.adpp.gateway.security.JwtUtil;

import io.jsonwebtoken.Claims;
import reactor.core.publisher.Mono;

@Component
public class JwtAuthenticationFilter implements GlobalFilter, Ordered {

    private static final Logger log =
            LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public int getOrder() {
        return -100; // run early
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange,
                             GatewayFilterChain chain) {

        final String path =
                exchange.getRequest().getURI().getPath();

        final HttpMethod method =
                exchange.getRequest().getMethod();

        log.debug("🌐 GATEWAY {} {}", method, path);

        /* ============================
           CORS PREFLIGHT — ALWAYS ALLOW
        ============================ */
        if (HttpMethod.OPTIONS.equals(method)) {
            return chain.filter(exchange);
        }

        /* ============================
           PUBLIC ROUTES
        ============================ */
        if (isPublicPath(path, method)) {

            String authHeader =
                    exchange.getRequest()
                            .getHeaders()
                            .getFirst(HttpHeaders.AUTHORIZATION);

            if (authHeader != null && authHeader.startsWith("Bearer ")) {

                try {
                    Claims claims =
                            jwtUtil.validateToken(authHeader.substring(7));

                    String userId =
                            String.valueOf(claims.get("userId"));

                    String role =
                            String.valueOf(claims.get("role")).toUpperCase();

                    ServerWebExchange mutated =
                            exchange.mutate()
                                    .request(builder -> {

                                        builder.header("X-USER-ID", userId);
                                        builder.header("X-USER-ROLE", role);
                                        builder.header(
                                                "X-REQUEST-ID",
                                                UUID.randomUUID().toString()
                                        );
                                    })
                                    .build();

                    return chain.filter(mutated);

                } catch (Exception e) {
                    // ignore token on public route
                }
            }

            return chain.filter(exchange);
        }


        /* ============================
           AUTH HEADER REQUIRED
        ============================ */
        String authHeader =
                exchange.getRequest()
                        .getHeaders()
                        .getFirst(HttpHeaders.AUTHORIZATION);

        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            log.warn("❌ Missing Authorization header");
            return unauthorized(exchange, "Missing token");
        }

        final String token =
                authHeader.substring(7);

        try {

            Claims claims =
                    jwtUtil.validateToken(token);

            Object userIdObj =
                    claims.get("userId");

            Object roleObj =
                    claims.get("role");

            if (userIdObj == null || roleObj == null) {
                return unauthorized(exchange,
                        "Invalid token claims");
            }

            final String userId =
                    String.valueOf(userIdObj);

            final String role =
                    String.valueOf(roleObj)
                            .toUpperCase();

            log.info("✅ AUTH user={} role={}", userId, role);

            /* ============================
               STRIP SPOOFED HEADERS
            ============================ */
            ServerWebExchange mutatedExchange =
                    exchange.mutate()
                            .request(builder -> {

                                builder.headers(headers -> {
                                    headers.remove("X-USER-ID");
                                    headers.remove("X-USER-ROLE");
                                    headers.remove("X-REQUEST-ID");
                                });

                                builder.header("X-USER-ID", userId);
                                builder.header("X-USER-ROLE", role);

                                // tracing across services
                                builder.header(
                                        "X-REQUEST-ID",
                                        UUID.randomUUID()
                                                .toString()
                                );
                            })
                            .build();

            return chain.filter(mutatedExchange);

        } catch (Exception ex) {

            log.error("❌ JWT validation failed", ex);

            return unauthorized(exchange,
                    "Invalid or expired token");
        }
    }

    /* ============================
       HELPERS
    ============================ */

    private boolean isPublicPath(String path,
                                 HttpMethod method) {

        // AUTH + DOCS
        if (path.startsWith("/auth")
                || path.startsWith("/swagger")
                || path.startsWith("/v3/api-docs")
                || path.startsWith("/actuator")) {
            return true;
        }

        // 🔥 PROPERTY BROWSING — PUBLIC ONLY FOR GET
     // 🔥 PUBLIC PROPERTY BROWSING — but NOT admin APIs
        if (HttpMethod.GET.equals(method)
                && path.startsWith("/properties")
                && !path.startsWith("/properties/admin")) {
            return true;
        }


        return false;
    }

    private Mono<Void> unauthorized(ServerWebExchange exchange,
                                    String message) {

        exchange.getResponse()
                .setStatusCode(HttpStatus.UNAUTHORIZED);

        exchange.getResponse()
                .getHeaders()
                .setContentType(MediaType.APPLICATION_JSON);

        byte[] bytes =
                ("{\"error\":\"" + message + "\"}")
                        .getBytes(StandardCharsets.UTF_8);

        return exchange.getResponse()
                .writeWith(Mono.just(
                        exchange.getResponse()
                                .bufferFactory()
                                .wrap(bytes)
                ));
    }
}
