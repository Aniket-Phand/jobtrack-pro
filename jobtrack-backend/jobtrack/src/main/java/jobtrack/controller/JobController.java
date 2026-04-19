package jobtrack.controller;

import jobtrack.dto.DashboardDTO;
import jobtrack.dto.JobDTO;
import jobtrack.entity.Job;
import jobtrack.entity.JobStatus;
import jobtrack.entity.User;
import jobtrack.service.JobService;
import jobtrack.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize; //ADD
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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

    //CREATE JOB (USER + ADMIN)
    @PostMapping
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public Job createJob(@RequestBody JobDTO jobDTO) {

        String email = getLoggedInUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Job job = new Job();
        job.setCompany(jobDTO.getCompany());
        job.setRole(jobDTO.getRole());
        job.setStatus(jobDTO.getStatus());
        job.setUser(user);

        return jobService.createJob(job);
    }

    //GET JOBS (USER + ADMIN)
    @GetMapping
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public Page<Job> getJobs(Pageable pageable) {

        String email = getLoggedInUserEmail();
        return jobService.getJobsByEmail(email, pageable);
    }

    //DELETE (USER + ADMIN)
    @DeleteMapping("/{jobId}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public String deleteJob(@PathVariable Long jobId) {

        String email = getLoggedInUserEmail();
        jobService.deleteJob(jobId, email);
        return "Job deleted successfully";
    }

    //UPDATE (USER + ADMIN)
    @PutMapping("/{jobId}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public Job updateJob(@PathVariable Long jobId, @RequestBody JobDTO jobDTO) {

        String email = getLoggedInUserEmail();

        Job job = new Job();
        job.setCompany(jobDTO.getCompany());
        job.setRole(jobDTO.getRole());
        job.setStatus(jobDTO.getStatus());

        return jobService.updateJob(jobId, job, email);
    }

    //SEARCH (USER + ADMIN)
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public Page<Job> searchJobs(
            @RequestParam JobStatus status,
            @RequestParam String company,
            Pageable pageable) {

        String email = getLoggedInUserEmail();
        return jobService.searchJobsByEmail(email, status, company, pageable);
    }

    //DASHBOARD (USER + ADMIN)
    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public DashboardDTO getDashboard() {

        String email = getLoggedInUserEmail();
        return jobService.getDashboardByEmail(email);
    }

    //COMMON METHOD
    private String getLoggedInUserEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getName();
    }
}