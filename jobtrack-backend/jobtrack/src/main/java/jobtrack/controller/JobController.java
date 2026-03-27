package jobtrack.controller;

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
    public Job createJob(@PathVariable Long userId, @RequestBody Job job) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

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
}