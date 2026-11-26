package com.enterprise.backend.controller;

import com.enterprise.backend.dto.LoginRequestDto;
import com.enterprise.backend.dto.LoginResponseDto;
import com.enterprise.backend.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.web.csrf.DefaultCsrfToken;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthControllerCookieTest {

    @Test
    void loginSetsHttpOnlySecureCookieAndDoesNotReturnJwt() {
        AuthService authService = mock(AuthService.class);
        AuthController controller = new AuthController(authService);
        ReflectionTestUtils.setField(controller, "authCookieSecure", true);
        when(authService.login(any(LoginRequestDto.class), eq("127.0.0.1")))
                .thenReturn(new LoginResponseDto("signed-jwt", "admin@example.com", "ADMIN", null, false));

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRemoteAddr("127.0.0.1");
        MockHttpServletResponse response = new MockHttpServletResponse();
        LoginRequestDto login = new LoginRequestDto();

        ResponseEntity<LoginResponseDto> result = controller.login(login, request, response);

        assertNull(result.getBody().getToken());
        assertTrue(response.getHeader("Set-Cookie").contains("EMS_ACCESS=signed-jwt"));
        assertTrue(response.getHeader("Set-Cookie").contains("HttpOnly"));
        assertTrue(response.getHeader("Set-Cookie").contains("Secure"));
        assertTrue(response.getHeader("Set-Cookie").contains("SameSite=None"));
        assertEquals("no-store", response.getHeader("Cache-Control"));
    }

    @Test
    void csrfEndpointReturnsTokenAndLogoutExpiresAccessCookie() {
        AuthController controller = new AuthController(mock(AuthService.class));
        ReflectionTestUtils.setField(controller, "authCookieSecure", true);

        assertEquals("csrf-value", controller.csrf(new DefaultCsrfToken("X-XSRF-TOKEN", "_csrf", "csrf-value")).get("token"));
        MockHttpServletResponse response = new MockHttpServletResponse();
        ResponseEntity<Void> result = controller.logout(response);

        assertEquals(204, result.getStatusCode().value());
        assertTrue(response.getHeader("Set-Cookie").contains("EMS_ACCESS="));
        assertTrue(response.getHeader("Set-Cookie").contains("Max-Age=0"));
        assertTrue(response.getHeader("Set-Cookie").contains("Secure"));
    }
}
