package jobtrack.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jobtrack.entity.User;
import jobtrack.repository.UserRepository;

@Service
public class UserService {
	
	@Autowired
	private UserRepository userRepository;
	
	public User createUser(User user) {
		return userRepository.save(user);
	}
	
	public List<User> getAllUsers(){
		return userRepository.findAll();
	}
	
	public void deleteUser(Long id) {
		userRepository.deleteById(id);
	}
	
	public User getUserById(Long id) {
	    return userRepository.findById(id)
	            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
	}
	
	public User updateUser(Long id, User updatedUser) {
	    User existingUser = userRepository.findById(id)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    existingUser.setName(updatedUser.getName());
	    existingUser.setEmail(updatedUser.getEmail());

	    return userRepository.save(existingUser);
	}
	
	
}
