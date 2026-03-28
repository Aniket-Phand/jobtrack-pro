package jobtrack.repository;

import jobtrack.entity.Job;
import jobtrack.entity.JobStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByUserId(Long userId);
    
    //For Pagination
    Page<Job> findByUserId(Long userId, Pageable pageable);
    
    //For Search & Filter
    Page<Job> findByUserIdAndStatusAndCompanyContainingIgnoreCase(
            Long userId,
            JobStatus status,
            String company,
            Pageable pageable
    );
}