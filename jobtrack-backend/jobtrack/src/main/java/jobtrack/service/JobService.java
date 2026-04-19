package jobtrack.service;

import jobtrack.dto.DashboardDTO;
import jobtrack.entity.Job;
import jobtrack.entity.JobStatus;
import jobtrack.entity.User;
import jobtrack.repository.JobRepository;
import jobtrack.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public JobService(JobRepository jobRepository, UserRepository userRepository) {
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    public Job createJob(Job job) {
        return jobRepository.save(job);
    }

    //GET JOBS BY EMAIL
    public Page<Job> getJobsByEmail(String email, Pageable pageable) {

        User user = getUserByEmail(email);
        return jobRepository.findByUserId(user.getId(), pageable);
    }

    public void deleteJob(Long jobId, String email) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        User loggedInUser = getUserByEmail(email);

        //ADMIN - can delete any job
        if (loggedInUser.getRole().name().equals("ADMIN")) {
            jobRepository.delete(job);
            return;
        }	

        //USER - can delete only their own job
        if (!job.getUser().getId().equals(loggedInUser.getId())) {
            throw new RuntimeException("You are not allowed to delete this job");
        }

        jobRepository.delete(job);
    }

    //Update Job
    public Job updateJob(Long id, Job updatedJob, String email) {

        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        User loggedInUser = getUserByEmail(email);

        //ADMIN → allow
        if (!loggedInUser.getRole().name().equals("ADMIN")) {

            //USER → only own job
            if (!job.getUser().getId().equals(loggedInUser.getId())) {
                throw new RuntimeException("You are not allowed to update this job");
            }
        }

        job.setCompany(updatedJob.getCompany());
        job.setRole(updatedJob.getRole());
        job.setStatus(updatedJob.getStatus());

        return jobRepository.save(job);
    }

    //SEARCH
    public Page<Job> searchJobsByEmail(String email, JobStatus status, String company, Pageable pageable) {

        User user = getUserByEmail(email);

        return jobRepository
                .findByUserIdAndStatusAndCompanyContainingIgnoreCase(
                        user.getId(),
                        status,
                        company,
                        pageable
                );
    }

    //DASHBOARD
    public DashboardDTO getDashboardByEmail(String email) {

        User user = getUserByEmail(email);
        Long userId = user.getId();

        long total = jobRepository.countByUserId(userId);
        long applied = jobRepository.countByUserIdAndStatus(userId, JobStatus.APPLIED);
        long interview = jobRepository.countByUserIdAndStatus(userId, JobStatus.INTERVIEW);
        long offer = jobRepository.countByUserIdAndStatus(userId, JobStatus.OFFER);
        long rejected = jobRepository.countByUserIdAndStatus(userId, JobStatus.REJECTED);

        return new DashboardDTO(total, applied, interview, offer, rejected);
    }

    //COMMON METHOD
    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}