package jobtrack.dto;

import jakarta.validation.constraints.NotBlank;
import jobtrack.entity.JobStatus;

public class JobDTO {

    private Long id;

    @NotBlank(message = "Company is required")
    private String company;

    @NotBlank(message = "Role is required")
    private String role;

    private JobStatus status;

    public JobDTO() {}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public JobStatus getStatus() {
		return status;
	}

	public void setStatus(JobStatus status) {
		this.status = status;
	}
    
}