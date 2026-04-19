package jobtrack.service;

import org.springframework.stereotype.Service;

import jobtrack.dto.AdminDashboardDTO;
import jobtrack.entity.JobStatus;
import jobtrack.repository.JobRepository;
import jobtrack.repository.UserRepository;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;

    public AdminService(UserRepository userRepository,
                        JobRepository jobRepository) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
    }

    public AdminDashboardDTO getDashboard() {

        long totalUsers = userRepository.count();
        long totalJobs = jobRepository.count();

        long applied = jobRepository.countByStatus(JobStatus.APPLIED);
        long interview = jobRepository.countByStatus(JobStatus.INTERVIEW);
        long offer = jobRepository.countByStatus(JobStatus.OFFER);
        long rejected = jobRepository.countByStatus(JobStatus.REJECTED);

        return new AdminDashboardDTO(
                totalUsers,
                totalJobs,
                applied,
                interview,
                offer,
                rejected
        );
    }
}