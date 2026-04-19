package jobtrack.dto;

public class AdminDashboardDTO {

    private long totalUsers;
    private long totalJobs;
    private long applied;
    private long interview;
    private long offer;
    private long rejected;

    public AdminDashboardDTO(long totalUsers, long totalJobs,
                             long applied, long interview,
                             long offer, long rejected) {
        this.totalUsers = totalUsers;
        this.totalJobs = totalJobs;
        this.applied = applied;
        this.interview = interview;
        this.offer = offer;
        this.rejected = rejected;
    }

    public long getTotalUsers() { return totalUsers; }
    public long getTotalJobs() { return totalJobs; }
    public long getApplied() { return applied; }
    public long getInterview() { return interview; }
    public long getOffer() { return offer; }
    public long getRejected() { return rejected; }
}