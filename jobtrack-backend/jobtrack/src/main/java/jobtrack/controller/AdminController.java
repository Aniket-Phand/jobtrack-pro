package jobtrack.controller;

import jobtrack.dto.AdminDashboardDTO;
import jobtrack.entity.User;
import jobtrack.entity.Role;
import jobtrack.repository.UserRepository;
import jobtrack.service.UserService;
import jobtrack.service.AdminService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final UserService userService;
    private final AdminService adminService;

    public AdminController(UserRepository userRepository,
                           UserService userService,
                           AdminService adminService) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.adminService = adminService;
    }

    // GET ALL USERS
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // DELETE USER (SAFE DELETE)
    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteUser(@PathVariable Long id) {

        String loggedInEmail = getLoggedInUserEmail();

        User loggedInUser = userRepository.findByEmail(loggedInEmail)
                .orElseThrow(() -> new RuntimeException("Logged-in user not found"));

        // Prevent self delete
        if (loggedInUser.getId().equals(id)) {
            throw new RuntimeException("Admin cannot delete themselves");
        }

        userService.deleteUser(id);
        return "User deleted successfully";
    }

    // CHANGE ROLE
    @PutMapping("/users/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public User updateRole(@PathVariable Long id, @RequestParam Role role) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setRole(role);
        return userRepository.save(user);
    }

    // ADMIN DASHBOARD
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public AdminDashboardDTO getDashboard() {
        return adminService.getDashboard();
    }

    // COMMON METHOD
    private String getLoggedInUserEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getName();
    }
}