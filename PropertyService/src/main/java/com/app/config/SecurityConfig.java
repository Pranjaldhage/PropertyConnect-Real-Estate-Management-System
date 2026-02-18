package com.app.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Configuration
public class SecurityConfig {

    private static final Logger log =
            LoggerFactory.getLogger(SecurityConfig.class);

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http)
            throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            // Gateway authenticates
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()
            )

            .addFilterBefore(
                roleFilter(),
                org.springframework.security.web.authentication
                        .UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }

    /* ===================================================
       ROLE + HEADER VALIDATION FILTER
    =================================================== */

    @Bean
    public OncePerRequestFilter roleFilter() {

        return new OncePerRequestFilter() {

            @Override
            protected void doFilterInternal(
                    HttpServletRequest request,
                    HttpServletResponse response,
                    FilterChain filterChain)
                    throws ServletException, IOException {

                final String path = request.getRequestURI();
                final String method = request.getMethod();

                // allow CORS preflight
                if (HttpMethod.OPTIONS.matches(method)) {
                    filterChain.doFilter(request, response);
                    return;
                }

                final String userId =
                        request.getHeader("X-USER-ID");

                final String role =
                        request.getHeader("X-USER-ROLE");

                /* =============================
                   PUBLIC PROPERTY ROUTES
                ============================= */
                if (method.equals("GET")
                        && (path.equals("/properties")
                            || path.matches("/properties/\\d+")
                            || path.startsWith("/properties/search"))) {

                    filterChain.doFilter(request, response);
                    return;
                }

                // everything else requires gateway headers
                if (userId == null || role == null) {

                    log.warn("Missing gateway headers for {}", path);

                    respond(
                            response,
                            HttpServletResponse.SC_UNAUTHORIZED,
                            "Missing gateway authentication headers");

                    return;
                }

                /* =============================
                   ADMIN ONLY
                ============================= */

                if (path.startsWith("/properties/admin")
                        || path.endsWith("/approve")
                        || path.endsWith("/reject")) {

                    if (!"ADMIN".equals(role)) {

                        respond(
                                response,
                                HttpServletResponse.SC_FORBIDDEN,
                                "ADMIN role required");

                        return;
                    }
                }

                filterChain.doFilter(request, response);
            }
        };
    }

    private void respond(
            HttpServletResponse response,
            int status,
            String message) throws IOException {

        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        response.getWriter()
                .write("{\"error\":\"" + message + "\"}");
    }
}
