package jobtrack.repository;

import jobtrack.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByUserId(Long userId);
    
    Page<Job> findByUserId(Long userId, Pageable pageable);
}