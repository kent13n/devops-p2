package com.openclassrooms.etudiant.handler;

import com.openclassrooms.etudiant.exception.ResourceNotFoundException;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;

import java.nio.file.AccessDeniedException;

import static org.assertj.core.api.Assertions.assertThat;

public class RestExceptionHandlerTest {

    private final RestExceptionHandler handler = new RestExceptionHandler();
    private final WebRequest request = new ServletWebRequest(new MockHttpServletRequest());

    @Test
    public void handleConflict_returns400() {
        ResponseEntity<Object> response = handler.handleConflict(
                new IllegalArgumentException("test"), request);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    public void handleBadCredentials_returns401() {
        ResponseEntity<Object> response = handler.handleBadCredentialsException(
                new BadCredentialsException("bad"), request);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    public void handleForbidden_returns403() {
        ResponseEntity<Object> response = handler.handleForbiddenException(
                new AccessDeniedException("denied"), request);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    public void handleNotFound_returns404() {
        ResponseEntity<Object> response = handler.handleNotFoundException(
                new ResourceNotFoundException("not found"), request);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    public void handleException_returns500() {
        ResponseEntity<Object> response = handler.handleException(
                new RuntimeException("error"), request);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
