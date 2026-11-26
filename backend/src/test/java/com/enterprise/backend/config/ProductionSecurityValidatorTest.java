package com.enterprise.backend.config;

import org.junit.jupiter.api.Test;
import org.springframework.mock.env.MockEnvironment;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class ProductionSecurityValidatorTest {
    private ProductionSecurityValidator validator(String profile, String url, String origins, boolean secureCookie) {
        ProductionSecurityValidator validator = new ProductionSecurityValidator();
        validator.setEnvironment(new MockEnvironment().withProperty("spring.profiles.active", profile));
        ReflectionTestUtils.setField(validator, "datasourceUrl", url);
        ReflectionTestUtils.setField(validator, "corsAllowedOrigins", origins);
        ReflectionTestUtils.setField(validator, "secureAuthCookie", secureCookie);
        return validator;
    }

    @Test
    void acceptsProductionConfigurationWithVerifiedDatabaseTlsAndHttpsOrigins() {
        assertDoesNotThrow(() -> validator("prod", "jdbc:mysql://db.example:3306/ems?sslMode=VERIFY_IDENTITY",
                "https://ems.example.com,https://admin.example.com", true).validateProductionConfiguration());
    }

    @Test
    void rejectsProductionConfigurationWithoutVerifiedDatabaseTls() {
        ProductionSecurityValidator validator = validator("prod", "jdbc:mysql://db.example:3306/ems?useSSL=true",
                "https://ems.example.com", true);
        IllegalStateException error = assertThrows(IllegalStateException.class, validator::validateProductionConfiguration);
        assertTrue(error.getMessage().contains("sslMode=VERIFY_IDENTITY"));
    }

    @Test
    void rejectsHttpCorsOriginsAndInsecureCookiesInProduction() {
        ProductionSecurityValidator insecureCookie = validator("prod", "jdbc:mysql://db:3306/ems?sslMode=VERIFY_IDENTITY",
                "https://ems.example.com", false);
        assertThrows(IllegalStateException.class, insecureCookie::validateProductionConfiguration);

        ProductionSecurityValidator httpOrigin = validator("prod", "jdbc:mysql://db:3306/ems?sslMode=VERIFY_IDENTITY",
                "http://ems.example.com", true);
        assertThrows(IllegalStateException.class, httpOrigin::validateProductionConfiguration);
    }
}
