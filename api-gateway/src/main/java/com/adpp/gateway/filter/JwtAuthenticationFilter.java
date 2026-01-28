package com.adpp.gateway.filter;

import io.jsonwebtoken.Claims;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import com.adpp.gateway.security.JwtUtil;

import reactor.core.publisher.Mono;

@Component
public class JwtAuthenticationFilter implements GlobalFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        String path = exchange.getRequest().getURI().getPath();

        System.out.println("🌐 GATEWAY PATH = " + path);

        /* ===================================================
           ✅ PUBLIC ROUTES (NO JWT REQUIRED)
        =================================================== */

        if (
                path.startsWith("/auth") ||

                // property browsing is public
                path.equals("/properties") ||
                path.startsWith("/properties/search") ||
                path.matches("/properties/\\d+") ||

                // swagger
                path.startsWith("/swagger") ||
                path.startsWith("/v3/api-docs")
        ) {
            return chain.filter(exchange);
        }

        /* ===================================================
           🔐 PROTECTED ROUTES
        =================================================== */

        String authHeader =
                exchange.getRequest()
                        .getHeaders()
                        .getFirst(HttpHeaders.AUTHORIZATION);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {

            System.out.println("❌ Missing Authorization header");

            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String token = authHeader.substring(7);

        try {

            Claims claims = jwtUtil.validateToken(token);

            String userId = claims.get("userId").toString();
            String role = claims.get("role").toString();

            System.out.println("✅ JWT VALID USER=" + userId + " ROLE=" + role);

            // forward headers to microservices
            exchange =
                    exchange.mutate()
                            .request(
                                    exchange.getRequest()
                                            .mutate()
                                            .header("X-USER-ID", userId)
                                            .header("X-USER-ROLE", role)
                                            .build()
                            )
                            .build();

        } catch (Exception e) {

            System.out.println("❌ JWT INVALID");
            e.printStackTrace();

            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        return chain.filter(exchange);
    }
}
