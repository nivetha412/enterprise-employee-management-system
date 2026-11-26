package com.enterprise.backend.security;

import com.enterprise.backend.entity.Employee;
import com.enterprise.backend.entity.User;
import com.enterprise.backend.enums.Role;
import com.enterprise.backend.repository.EmployeeRepository;
import com.enterprise.backend.repository.UserRepository;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        return "/api/auth/login".equals(path)
                || "/api/auth/csrf".equals(path)
                || "/api/auth/logout".equals(path);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        String token = null;
        if (header != null && header.startsWith("Bearer ")) {
            token = header.substring(7);
        } else if (request.getCookies() != null) {
            for (var cookie : request.getCookies()) {
                if ("EMS_ACCESS".equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
        }
        if (token == null || token.isBlank()) {
            chain.doFilter(request, response);
            return;
        }
        try {
            String subject = jwtService.extractEmail(token);
            Role roleFromToken = jwtService.extractRole(token);
            long tokenVersion = jwtService.extractTokenVersion(token);

            if (roleFromToken == null) {
                SecurityContextHolder.clearContext();
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired session");
                return;
            }

            Optional<Employee> employeeAccount = Optional.empty();
            boolean accountIsValid;
            if (roleFromToken == Role.ADMIN) {
                accountIsValid = userRepository.findByEmailIgnoreCase(subject)
                        .filter(User::getActive)
                        .filter(user -> user.getRole() == roleFromToken)
                        .filter(user -> tokenVersionMatches(user.getTokenVersion(), tokenVersion))
                        .map(user -> true)
                        .orElse(false);
            } else {
                employeeAccount = employeeRepository.findByEmployeeCodeIgnoreCase(subject)
                        .filter(Employee::getActive)
                        .filter(employee -> tokenVersionMatches(employee.getTokenVersion(), tokenVersion));
                accountIsValid = employeeAccount.isPresent();
            }

            if (!accountIsValid) {
                SecurityContextHolder.clearContext();
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired session");
                return;
            }

            if (roleFromToken == Role.EMPLOYEE
                    && employeeAccount.map(employee -> Boolean.TRUE.equals(employee.getMustChangePassword())).orElse(false)
                    && !isAllowedDuringForcedPasswordChange(request)) {
                SecurityContextHolder.clearContext();
                response.sendError(HttpServletResponse.SC_FORBIDDEN, "Password change is required before using this feature");
                return;
            }

            if (SecurityContextHolder.getContext().getAuthentication() == null) {
                var auth = new UsernamePasswordAuthenticationToken(subject, null,
                        List.of(new SimpleGrantedAuthority("ROLE_" + roleFromToken.name())));
                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        } catch (JwtException | IllegalArgumentException ignored) {
            SecurityContextHolder.clearContext();
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token");
            return;
        }
        chain.doFilter(request, response);
    }

    private boolean tokenVersionMatches(Long accountVersion, long tokenVersion) {
        return (accountVersion == null ? 0L : accountVersion) == tokenVersion;
    }

    private boolean isAllowedDuringForcedPasswordChange(HttpServletRequest request) {
        String path = request.getServletPath();
        String method = request.getMethod();
        return ("/api/auth/me".equals(path) && "GET".equals(method))
                || ("/api/employees/me/password".equals(path) && "PUT".equals(method))
                || ("/api/employees/me".equals(path)
                    && ("GET".equals(method) || "PUT".equals(method)));
    }
}
