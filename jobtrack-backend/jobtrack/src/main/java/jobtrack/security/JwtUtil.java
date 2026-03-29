package jobtrack.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    //include role
    public String generateToken(String email, String role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role) // 🔥 ADD ROLE
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
                .signWith(key)
                .compact();
    }

    //extract email
    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    //extract role
    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    //reusable method
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}