package jobtrack.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import jobtrack.dto.UserDTO;
import jobtrack.entity.User;
import jobtrack.service.UserService;


@RestController
@RequestMapping("/users")
public class UserController {
	
	@Autowired
	private UserService userService;
	
	//CREATE 
	@PostMapping
	public User createUser(@Valid @RequestBody UserDTO userDTO) {
	    User user = new User();
	    user.setName(userDTO.getName());
	    user.setEmail(userDTO.getEmail());

	    return userService.createUser(user);
	}
	
	
	//READ
	@GetMapping
	public List<User> getAllUsers(){
		return userService.getAllUsers();
	}
	
	//DELETE
	@DeleteMapping("/{id}")
	public String deleteUser(@PathVariable Long id) {
		userService.deleteUser(id);
		return "User deleted successfully";
	}
	
	@GetMapping("/{id}")
	public User getUser(@PathVariable Long id) {
	    return userService.getUserById(id);
	}
	
	@PutMapping("/{id}")
	public User updateUser(@PathVariable Long id, @RequestBody User user) {
	    return userService.updateUser(id, user);
	}
	
}
