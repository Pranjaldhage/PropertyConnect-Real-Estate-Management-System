package com.app.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            // 🔥 DO NOT authenticate here — gateway already did it
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()
            )

            // role check after headers arrive
            .addFilterBefore(
                roleFilter(),
                org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }

    /* ===================================================
       ROLE CHECK FILTER (reads X-USER-ROLE from Gateway)
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

                String path = request.getRequestURI();
                String role = request.getHeader("X-USER-ROLE");

                /* =============================
                   ADMIN ONLY ENDPOINTS
                ============================= */

                if (
                        path.startsWith("/properties/admin") ||
                        path.contains("/approve")
                ) {

                    if (!"ADMIN".equals(role)) {

                        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                        response.getWriter()
                                .write("ADMIN role required");

                        return;
                    }
                }

                filterChain.doFilter(request, response);
            }
        };
    }
}
