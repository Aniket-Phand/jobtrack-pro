package jobtrack.service;

import jobtrack.entity.Job;
import jobtrack.repository.JobRepository;
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

    public void deleteJob(Long id) {
        jobRepository.deleteById(id);
    }
}