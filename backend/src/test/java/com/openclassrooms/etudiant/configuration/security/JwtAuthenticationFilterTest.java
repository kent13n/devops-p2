package com.openclassrooms.etudiant.configuration.security;

import com.openclassrooms.etudiant.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.io.IOException;
import java.util.Collections;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(SpringExtension.class)
public class JwtAuthenticationFilterTest {

    @Mock
    private JwtService jwtService;

    @Mock
    private CustomUserDetailService customUserDetailService;

    @Mock
    private FilterChain filterChain;

    @InjectMocks
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    private MockHttpServletRequest request;
    private MockHttpServletResponse response;

    @BeforeEach
    void setUp() {
        request = new MockHttpServletRequest();
        response = new MockHttpServletResponse();
        SecurityContextHolder.clearContext();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void doFilterInternal_noAuthHeader_continuesFilterChain() throws ServletException, IOException {
        // GIVEN — pas de header Authorization

        // WHEN
        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        // THEN
        verify(filterChain).doFilter(request, response);
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
    }

    @Test
    void doFilterInternal_invalidAuthHeaderFormat_continuesFilterChain() throws ServletException, IOException {
        // GIVEN — header qui ne commence pas par "Bearer "
        request.addHeader("Authorization", "Basic abc123");

        // WHEN
        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        // THEN
        verify(filterChain).doFilter(request, response);
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
    }

    @Test
    void doFilterInternal_validToken_setsAuthentication() throws ServletException, IOException {
        // GIVEN
        String token = "valid.jwt.token";
        UserDetails userDetails = buildUserDetails("testuser");

        request.addHeader("Authorization", "Bearer " + token);
        when(jwtService.extractUsername(token)).thenReturn("testuser");
        when(customUserDetailService.loadUserByUsername("testuser")).thenReturn(userDetails);
        when(jwtService.isTokenValid(token, userDetails)).thenReturn(true);

        // WHEN
        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        // THEN
        verify(filterChain).doFilter(request, response);
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNotNull();
        assertThat(SecurityContextHolder.getContext().getAuthentication().getName()).isEqualTo("testuser");
    }

    @Test
    void doFilterInternal_invalidToken_doesNotSetAuthentication() throws ServletException, IOException {
        // GIVEN — token invalide (isTokenValid retourne false)
        String token = "invalid.jwt.token";
        UserDetails userDetails = buildUserDetails("testuser");

        request.addHeader("Authorization", "Bearer " + token);
        when(jwtService.extractUsername(token)).thenReturn("testuser");
        when(customUserDetailService.loadUserByUsername("testuser")).thenReturn(userDetails);
        when(jwtService.isTokenValid(token, userDetails)).thenReturn(false);

        // WHEN
        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        // THEN
        verify(filterChain).doFilter(request, response);
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
    }

    @Test
    void doFilterInternal_authenticationAlreadySet_doesNotOverride() throws ServletException, IOException {
        // GIVEN — authentification déjà présente dans le contexte
        String token = "valid.jwt.token";
        UserDetails existingUser = buildUserDetails("existinguser");
        UsernamePasswordAuthenticationToken existingAuth =
                new UsernamePasswordAuthenticationToken(existingUser, null, existingUser.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(existingAuth);

        request.addHeader("Authorization", "Bearer " + token);
        when(jwtService.extractUsername(token)).thenReturn("testuser");

        // WHEN
        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        // THEN — l'authentification existante n'est pas écrasée
        verify(filterChain).doFilter(request, response);
        verify(customUserDetailService, never()).loadUserByUsername(any());
        assertThat(SecurityContextHolder.getContext().getAuthentication().getName()).isEqualTo("existinguser");
    }

    @Test
    void doFilterInternal_extractUsernameThrowsException_continuesFilterChain() throws ServletException, IOException {
        // GIVEN — token malformé qui provoque une exception
        String token = "malformed.token";
        request.addHeader("Authorization", "Bearer " + token);
        when(jwtService.extractUsername(token)).thenThrow(new RuntimeException("Token malformé"));

        // WHEN
        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        // THEN — la requête continue sans authentification
        verify(filterChain).doFilter(request, response);
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
    }

    private UserDetails buildUserDetails(String username) {
        return User.builder()
                .username(username)
                .password("")
                .authorities(Collections.emptyList())
                .build();
    }
}
