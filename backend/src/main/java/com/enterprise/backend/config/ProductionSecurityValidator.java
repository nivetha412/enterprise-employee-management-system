package com.enterprise.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.EnvironmentAware;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.core.env.Profiles;
import org.springframework.util.StringUtils;

import java.net.URI;
import java.util.Arrays;

@Configuration
public class ProductionSecurityValidator implements EnvironmentAware {
    private Environment environment;

    @Value("${spring.datasource.url}")
    private String datasourceUrl;

    @Value("${app.cors.allowed-origins:}")
    private String corsAllowedOrigins;

    @Value("${app.auth.cookie-secure:false}")
    private boolean secureAuthCookie;

    @Override
    public void setEnvironment(Environment environment) {
        this.environment = environment;
    }

    @jakarta.annotation.PostConstruct
    void validateProductionConfiguration() {
        if (environment == null || !environment.acceptsProfiles(Profiles.of("prod"))) {
            return;
        }
        if (!secureAuthCookie) {
            throw new IllegalStateException("AUTH_COOKIE_SECURE must be true in production");
        }
        if (!StringUtils.hasText(corsAllowedOrigins)) {
            throw new IllegalStateException("CORS_ALLOWED_ORIGINS must contain trusted HTTPS origins in production");
        }
        boolean hasInvalidOrigin = Arrays.stream(corsAllowedOrigins.split(","))
                .map(String::trim)
                .filter(StringUtils::hasText)
                .anyMatch(origin -> {
                    try {
                        URI uri = URI.create(origin);
                        return !"https".equalsIgnoreCase(uri.getScheme())
                                || !StringUtils.hasText(uri.getHost())
                                || origin.contains("*")
                                || StringUtils.hasText(uri.getRawUserInfo())
                                || StringUtils.hasText(uri.getRawQuery())
                                || StringUtils.hasText(uri.getRawFragment())
                                || StringUtils.hasText(uri.getRawPath());
                    } catch (IllegalArgumentException invalidUri) {
                        return true;
                    }
                });
        if (hasInvalidOrigin) {
            throw new IllegalStateException("Every CORS_ALLOWED_ORIGINS entry must be an exact HTTPS origin in production");
        }
        if (datasourceUrl == null || !datasourceUrl.matches("(?i).*([?&])sslMode=VERIFY_IDENTITY(&.*)?$")) {
            throw new IllegalStateException("Production DB_URL must enable MySQL TLS with sslMode=VERIFY_IDENTITY");
        }
    }
}
