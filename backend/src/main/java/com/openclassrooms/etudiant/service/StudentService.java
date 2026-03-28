package com.openclassrooms.etudiant.service;

import com.openclassrooms.etudiant.entities.Student;
import com.openclassrooms.etudiant.exception.ResourceNotFoundException;
import com.openclassrooms.etudiant.repository.StudentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;

    public Student create(Student student) {
        log.info("Création d'un nouvel étudiant avec l'email : {}", student.getEmail());

        Optional<Student> existing = studentRepository.findByEmail(student.getEmail());
        if (existing.isPresent()) {
            throw new IllegalArgumentException("Un étudiant avec l'email " + student.getEmail() + " existe déjà");
        }

        return studentRepository.save(student);
    }

    public List<Student> findAll() {
        log.info("Récupération de tous les étudiants");
        return studentRepository.findAll();
    }

    public Student findById(Long id) {
        log.info("Récupération de l'étudiant avec l'id : {}", id);
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Étudiant non trouvé avec l'id : " + id));
    }

    public Student update(Long id, Student studentData) {
        log.info("Mise à jour de l'étudiant avec l'id : {}", id);

        Student existingStudent = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Étudiant non trouvé avec l'id : " + id));

        // Vérifier l'unicité de l'email si celui-ci a changé
        if (!existingStudent.getEmail().equals(studentData.getEmail())) {
            Optional<Student> studentWithEmail = studentRepository.findByEmail(studentData.getEmail());
            if (studentWithEmail.isPresent()) {
                throw new IllegalArgumentException("Un étudiant avec l'email " + studentData.getEmail() + " existe déjà");
            }
        }

        existingStudent.setFirstName(studentData.getFirstName());
        existingStudent.setLastName(studentData.getLastName());
        existingStudent.setEmail(studentData.getEmail());

        return studentRepository.save(existingStudent);
    }

    public void delete(Long id) {
        log.info("Suppression de l'étudiant avec l'id : {}", id);

        if (!studentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Étudiant non trouvé avec l'id : " + id);
        }

        studentRepository.deleteById(id);
    }
}
