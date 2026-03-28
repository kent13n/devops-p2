package com.openclassrooms.etudiant.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.etudiant.dto.StudentRequestDTO;
import com.openclassrooms.etudiant.entities.Student;
import com.openclassrooms.etudiant.entities.User;
import com.openclassrooms.etudiant.repository.StudentRepository;
import com.openclassrooms.etudiant.repository.UserRepository;
import com.openclassrooms.etudiant.service.JwtService;
import com.openclassrooms.etudiant.service.UserService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@Testcontainers
public class StudentControllerTest {

    private static final String URL = "/api/students";
    private static final String FIRST_NAME = "Marie";
    private static final String LAST_NAME = "Martin";
    private static final String EMAIL = "marie@mail.com";

    @Container
    static MySQLContainer mySQLContainer = new MySQLContainer("mysql:8.0");

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private JwtService jwtService;

    private String jwtToken;

    @DynamicPropertySource
    static void configureTestProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", () -> mySQLContainer.getJdbcUrl());
        registry.add("spring.datasource.username", () -> mySQLContainer.getUsername());
        registry.add("spring.datasource.password", () -> mySQLContainer.getPassword());
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "create");
    }

    @BeforeEach
    public void setUp() {
        // Créer un utilisateur et générer un token JWT pour les requêtes authentifiées
        User user = new User();
        user.setFirstName("Test");
        user.setLastName("User");
        user.setLogin("testuser");
        user.setPassword("password");
        userService.register(user);

        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username("testuser").password("").build();
        jwtToken = jwtService.generateToken(userDetails);
    }

    @AfterEach
    public void afterEach() {
        studentRepository.deleteAll();
        userRepository.deleteAll();
    }

    // --- POST /api/students ---

    @Test
    public void createStudent_authenticated_returns201() throws Exception {
        // GIVEN
        StudentRequestDTO dto = new StudentRequestDTO(FIRST_NAME, LAST_NAME, EMAIL);

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.post(URL)
                        .header("Authorization", "Bearer " + jwtToken)
                        .content(objectMapper.writeValueAsString(dto))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(MockMvcResultMatchers.status().isCreated());
    }

    @Test
    public void createStudent_unauthenticated_returns401() throws Exception {
        // GIVEN
        StudentRequestDTO dto = new StudentRequestDTO(FIRST_NAME, LAST_NAME, EMAIL);

        // WHEN — pas de header Authorization
        mockMvc.perform(MockMvcRequestBuilders.post(URL)
                        .content(objectMapper.writeValueAsString(dto))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(MockMvcResultMatchers.status().isUnauthorized());
    }

    @Test
    public void createStudent_withoutRequiredData_returns400() throws Exception {
        // GIVEN
        StudentRequestDTO dto = new StudentRequestDTO();

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.post(URL)
                        .header("Authorization", "Bearer " + jwtToken)
                        .content(objectMapper.writeValueAsString(dto))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(MockMvcResultMatchers.status().isBadRequest());
    }

    @Test
    public void createStudent_duplicateEmail_returns400() throws Exception {
        // GIVEN — créer un étudiant directement en BDD
        Student existing = new Student();
        existing.setFirstName(FIRST_NAME);
        existing.setLastName(LAST_NAME);
        existing.setEmail(EMAIL);
        studentRepository.save(existing);

        StudentRequestDTO dto = new StudentRequestDTO(FIRST_NAME, LAST_NAME, EMAIL);

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.post(URL)
                        .header("Authorization", "Bearer " + jwtToken)
                        .content(objectMapper.writeValueAsString(dto))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(MockMvcResultMatchers.status().isBadRequest());
    }

    // --- GET /api/students ---

    @Test
    public void findAll_authenticated_returns200() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get(URL)
                        .header("Authorization", "Bearer " + jwtToken))
                .andDo(print())
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    public void findAll_unauthenticated_returns401() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get(URL))
                .andDo(print())
                .andExpect(MockMvcResultMatchers.status().isUnauthorized());
    }

    // --- GET /api/students/{id} ---

    @Test
    public void findById_existingId_returns200() throws Exception {
        // GIVEN
        Student student = new Student();
        student.setFirstName(FIRST_NAME);
        student.setLastName(LAST_NAME);
        student.setEmail(EMAIL);
        student = studentRepository.save(student);

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.get(URL + "/" + student.getId())
                        .header("Authorization", "Bearer " + jwtToken))
                .andDo(print())
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    public void findById_unknownId_returns404() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get(URL + "/999")
                        .header("Authorization", "Bearer " + jwtToken))
                .andDo(print())
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    // --- PUT /api/students/{id} ---

    @Test
    public void updateStudent_existingId_returns200() throws Exception {
        // GIVEN
        Student student = new Student();
        student.setFirstName(FIRST_NAME);
        student.setLastName(LAST_NAME);
        student.setEmail(EMAIL);
        student = studentRepository.save(student);

        StudentRequestDTO dto = new StudentRequestDTO("Jean", "Dupont", "jean@mail.com");

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.put(URL + "/" + student.getId())
                        .header("Authorization", "Bearer " + jwtToken)
                        .content(objectMapper.writeValueAsString(dto))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    // --- DELETE /api/students/{id} ---

    @Test
    public void deleteStudent_existingId_returns204() throws Exception {
        // GIVEN
        Student student = new Student();
        student.setFirstName(FIRST_NAME);
        student.setLastName(LAST_NAME);
        student.setEmail(EMAIL);
        student = studentRepository.save(student);

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.delete(URL + "/" + student.getId())
                        .header("Authorization", "Bearer " + jwtToken))
                .andDo(print())
                .andExpect(MockMvcResultMatchers.status().isNoContent());
    }
}
