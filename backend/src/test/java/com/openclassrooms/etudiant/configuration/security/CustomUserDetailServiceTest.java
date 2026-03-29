package com.openclassrooms.etudiant.configuration.security;

import com.openclassrooms.etudiant.entities.User;
import com.openclassrooms.etudiant.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(SpringExtension.class)
public class CustomUserDetailServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CustomUserDetailService customUserDetailService;

    @Test
    public void loadUserByUsername_existingUser_returnsUserDetails() {
        // GIVEN
        User user = new User();
        user.setLogin("testuser");
        user.setPassword("password");
        user.setFirstName("Test");
        user.setLastName("User");
        when(userRepository.findByLogin("testuser")).thenReturn(Optional.of(user));

        // WHEN
        UserDetails result = customUserDetailService.loadUserByUsername("testuser");

        // THEN
        assertThat(result.getUsername()).isEqualTo("testuser");
    }

    @Test
    public void loadUserByUsername_unknownUser_throwsUsernameNotFoundException() {
        // GIVEN
        when(userRepository.findByLogin("unknown")).thenReturn(Optional.empty());

        // THEN
        assertThrows(UsernameNotFoundException.class,
                () -> customUserDetailService.loadUserByUsername("unknown"));
    }
}
