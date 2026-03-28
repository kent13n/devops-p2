package com.openclassrooms.etudiant.service;

import com.openclassrooms.etudiant.entities.Student;
import com.openclassrooms.etudiant.exception.ResourceNotFoundException;
import com.openclassrooms.etudiant.repository.StudentRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(SpringExtension.class)
public class StudentServiceTest {

    private static final String FIRST_NAME = "Marie";
    private static final String LAST_NAME = "Martin";
    private static final String EMAIL = "marie@mail.com";

    @Mock
    private StudentRepository studentRepository;

    @InjectMocks
    private StudentService studentService;

    // --- create ---

    @Test
    public void create_validStudent_savesStudent() {
        // GIVEN
        Student student = buildStudent();
        when(studentRepository.findByEmail(any())).thenReturn(Optional.empty());
        when(studentRepository.save(any())).thenReturn(student);

        // WHEN
        Student result = studentService.create(student);

        // THEN
        ArgumentCaptor<Student> captor = ArgumentCaptor.forClass(Student.class);
        verify(studentRepository).save(captor.capture());
        assertThat(captor.getValue().getEmail()).isEqualTo(EMAIL);
        assertThat(result).isEqualTo(student);
    }

    @Test
    public void create_duplicateEmail_throwsIllegalArgumentException() {
        // GIVEN
        Student student = buildStudent();
        when(studentRepository.findByEmail(EMAIL)).thenReturn(Optional.of(student));

        // THEN
        Assertions.assertThrows(IllegalArgumentException.class,
                () -> studentService.create(student));
    }

    // --- findAll ---

    @Test
    public void findAll_returnsStudentList() {
        // GIVEN
        when(studentRepository.findAll()).thenReturn(List.of(buildStudent()));

        // WHEN
        List<Student> result = studentService.findAll();

        // THEN
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getEmail()).isEqualTo(EMAIL);
    }

    // --- findById ---

    @Test
    public void findById_existingId_returnsStudent() {
        // GIVEN
        Student student = buildStudent();
        student.setId(1L);
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));

        // WHEN
        Student result = studentService.findById(1L);

        // THEN
        assertThat(result.getId()).isEqualTo(1L);
    }

    @Test
    public void findById_unknownId_throwsResourceNotFoundException() {
        // GIVEN
        when(studentRepository.findById(999L)).thenReturn(Optional.empty());

        // THEN
        Assertions.assertThrows(ResourceNotFoundException.class,
                () -> studentService.findById(999L));
    }

    // --- update ---

    @Test
    public void update_existingStudent_updatesAndSaves() {
        // GIVEN
        Student existing = buildStudent();
        existing.setId(1L);
        when(studentRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(studentRepository.findByEmail(any())).thenReturn(Optional.empty());
        when(studentRepository.save(any())).thenReturn(existing);

        Student newData = new Student();
        newData.setFirstName("Jean");
        newData.setLastName("Dupont");
        newData.setEmail("jean@mail.com");

        // WHEN
        studentService.update(1L, newData);

        // THEN
        ArgumentCaptor<Student> captor = ArgumentCaptor.forClass(Student.class);
        verify(studentRepository).save(captor.capture());
        assertThat(captor.getValue().getFirstName()).isEqualTo("Jean");
        assertThat(captor.getValue().getEmail()).isEqualTo("jean@mail.com");
    }

    @Test
    public void update_duplicateEmail_throwsIllegalArgumentException() {
        // GIVEN
        Student existing = buildStudent();
        existing.setId(1L);

        Student other = new Student();
        other.setId(2L);
        other.setEmail("other@mail.com");

        when(studentRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(studentRepository.findByEmail("other@mail.com")).thenReturn(Optional.of(other));

        Student newData = new Student();
        newData.setFirstName(FIRST_NAME);
        newData.setLastName(LAST_NAME);
        newData.setEmail("other@mail.com");

        // THEN
        Assertions.assertThrows(IllegalArgumentException.class,
                () -> studentService.update(1L, newData));
    }

    @Test
    public void update_unknownId_throwsResourceNotFoundException() {
        // GIVEN
        when(studentRepository.findById(999L)).thenReturn(Optional.empty());

        // THEN
        Assertions.assertThrows(ResourceNotFoundException.class,
                () -> studentService.update(999L, new Student()));
    }

    // --- delete ---

    @Test
    public void delete_existingId_deletesStudent() {
        // GIVEN
        when(studentRepository.existsById(1L)).thenReturn(true);

        // WHEN
        studentService.delete(1L);

        // THEN
        verify(studentRepository).deleteById(1L);
    }

    @Test
    public void delete_unknownId_throwsResourceNotFoundException() {
        // GIVEN
        when(studentRepository.existsById(999L)).thenReturn(false);

        // THEN
        Assertions.assertThrows(ResourceNotFoundException.class,
                () -> studentService.delete(999L));
    }

    private Student buildStudent() {
        Student student = new Student();
        student.setFirstName(FIRST_NAME);
        student.setLastName(LAST_NAME);
        student.setEmail(EMAIL);
        return student;
    }
}
