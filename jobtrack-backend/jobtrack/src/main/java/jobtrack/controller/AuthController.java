package jobtrack.controller;

import jobtrack.entity.User;
import jobtrack.repository.UserRepository;
import jobtrack.security.JwtUtil;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userRepository.save(user);
    }

    @PostMapping("/login")
    public String login(@RequestBody User user) {

        User existingUser = userRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!existingUser.getName().equals(user.getName())) {
            throw new RuntimeException("Invalid credentials");
        }

        return jwtUtil.generateToken(user.getEmail());
    }
}