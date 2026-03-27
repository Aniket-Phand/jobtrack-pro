package jobtrack.controller;

import jobtrack.dto.JobDTO;
import jobtrack.entity.Job;
import jobtrack.entity.User;
import jobtrack.service.JobService;
import jobtrack.repository.UserRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/jobs")
public class JobController {

    private final JobService jobService;
    private final UserRepository userRepository;

    public JobController(JobService jobService, UserRepository userRepository) {
        this.jobService = jobService;
        this.userRepository = userRepository;
    }

    @PostMapping("/{userId}")
    public Job createJob(@PathVariable Long userId, @RequestBody JobDTO jobDTO) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Job job = new Job();
        job.setCompany(jobDTO.getCompany());
        job.setRole(jobDTO.getRole());
        job.setStatus(jobDTO.getStatus());
        job.setUser(user);

        return jobService.createJob(job);
    }
    

    @GetMapping("/{userId}")
    public List<Job> getJobs(@PathVariable Long userId) {
        return jobService.getJobsByUser(userId);
    }

    @DeleteMapping("/{jobId}")
    public String deleteJob(@PathVariable Long jobId) {
        jobService.deleteJob(jobId);
        return "Job deleted successfully";
    }
    
    @PutMapping("/{jobId}")
    public Job updateJob(@PathVariable Long jobId, @RequestBody JobDTO jobDTO) {

        Job job = new Job();
        job.setCompany(jobDTO.getCompany());
        job.setRole(jobDTO.getRole());
        job.setStatus(jobDTO.getStatus());

        return jobService.updateJob(jobId, job);
    }
 
}