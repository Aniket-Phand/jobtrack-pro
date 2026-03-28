package jobtrack.service;

import jobtrack.entity.Job;
import jobtrack.repository.JobRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobService {

    private final JobRepository jobRepository;

    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    public Job createJob(Job job) {
        return jobRepository.save(job);
    }

	 public List<Job> getJobsByUser(Long userId) { 
		 return jobRepository.findByUserId(userId); 
	}

	 public Page<Job> getJobsByUser(Long userId, Pageable pageable) {
		    return jobRepository.findByUserId(userId, pageable);
	}

    public void deleteJob(Long id) {
        jobRepository.deleteById(id);
    }
    
    
    public Job updateJob(Long id, Job updatedJob) {

        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        job.setCompany(updatedJob.getCompany());
        job.setRole(updatedJob.getRole());
        job.setStatus(updatedJob.getStatus());

        return jobRepository.save(job);
    }
}