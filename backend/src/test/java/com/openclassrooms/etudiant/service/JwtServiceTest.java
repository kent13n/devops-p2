package com.openclassrooms.etudiant.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import io.jsonwebtoken.ExpiredJwtException;
import org.junit.jupiter.api.Assertions;

import static org.assertj.core.api.Assertions.assertThat;

public class JwtServiceTest {

    private JwtService jwtService;

    // Clé suffisamment longue pour HMAC-SHA256
    private static final String SECRET = "monSecretDeTestQuiDoitFaireAuMoins256BitsDeuxCentCinquanteSixBits";
    private static final long EXPIRATION = 86400000L;
    private static final String USERNAME = "testuser";

    @BeforeEach
    public void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secret", SECRET);
        ReflectionTestUtils.setField(jwtService, "expiration", EXPIRATION);
    }

    @Test
    public void generateToken_returnsNonEmptyString() {
        // GIVEN
        UserDetails userDetails = buildUserDetails(USERNAME);

        // WHEN
        String token = jwtService.generateToken(userDetails);

        // THEN
        assertThat(token).isNotNull().isNotEmpty();
    }

    @Test
    public void extractUsername_returnsCorrectUsername() {
        // GIVEN
        UserDetails userDetails = buildUserDetails(USERNAME);
        String token = jwtService.generateToken(userDetails);

        // WHEN
        String extracted = jwtService.extractUsername(token);

        // THEN
        assertThat(extracted).isEqualTo(USERNAME);
    }

    @Test
    public void isTokenValid_withValidToken_returnsTrue() {
        // GIVEN
        UserDetails userDetails = buildUserDetails(USERNAME);
        String token = jwtService.generateToken(userDetails);

        // WHEN
        boolean valid = jwtService.isTokenValid(token, userDetails);

        // THEN
        assertThat(valid).isTrue();
    }

    @Test
    public void isTokenValid_withWrongUser_returnsFalse() {
        // GIVEN
        UserDetails userDetails = buildUserDetails(USERNAME);
        UserDetails otherUser = buildUserDetails("otheruser");
        String token = jwtService.generateToken(userDetails);

        // WHEN
        boolean valid = jwtService.isTokenValid(token, otherUser);

        // THEN
        assertThat(valid).isFalse();
    }

    @Test
    public void isTokenValid_withExpiredToken_throwsExpiredJwtException() {
        // GIVEN — service avec expiration négative pour créer un token déjà expiré
        JwtService expiredJwtService = new JwtService();
        ReflectionTestUtils.setField(expiredJwtService, "secret", SECRET);
        ReflectionTestUtils.setField(expiredJwtService, "expiration", -1000L);

        UserDetails userDetails = buildUserDetails(USERNAME);
        String expiredToken = expiredJwtService.generateToken(userDetails);

        // WHEN / THEN — JJWT lance une exception pour un token expiré
        Assertions.assertThrows(ExpiredJwtException.class,
                () -> jwtService.isTokenValid(expiredToken, userDetails));
    }

    private UserDetails buildUserDetails(String username) {
        return User.builder()
                .username(username)
                .password("")
                .build();
    }
}
