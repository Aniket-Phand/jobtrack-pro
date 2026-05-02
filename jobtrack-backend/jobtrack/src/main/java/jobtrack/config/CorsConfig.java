package jobtrack.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {

        CorsConfiguration config = new CorsConfiguration();

        // 🔐 Allow credentials (important for auth headers)
        config.setAllowCredentials(true);

        // 🌐 Allowed Origins (Frontend URLs)
        config.setAllowedOrigins(List.of(
                "http://localhost:5173",                  // local dev
                "https://jobtrack-pro-chi.vercel.app"     // deployed frontend
        ));

        // 📦 Allowed Headers
        config.setAllowedHeaders(List.of("*"));

        // 🔁 Allowed Methods
        config.setAllowedMethods(List.of(
                "GET", "POST", "PUT", "DELETE", "OPTIONS"
        ));

        // ⚙️ Apply config to all endpoints
        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}