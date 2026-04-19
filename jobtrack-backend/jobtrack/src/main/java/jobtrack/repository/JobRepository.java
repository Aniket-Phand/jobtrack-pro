package jobtrack.repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jobtrack.entity.Job;
import jobtrack.entity.JobStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByUserId(Long userId);
    
    // Pagination
    Page<Job> findByUserId(Long userId, Pageable pageable);
    
    // Search & Filter
    Page<Job> findByUserIdAndStatusAndCompanyContainingIgnoreCase(
            Long userId,
            JobStatus status,
            String company,
            Pageable pageable
    );
    
    // Dashboard
    long countByUserId(Long userId);
    long countByUserIdAndStatus(Long userId, JobStatus status);

    // ✅ FIXED DELETE QUERY
    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("DELETE FROM Job j WHERE j.user.id = :userId")
    void deleteJobsByUserId(@Param("userId") Long userId);
}