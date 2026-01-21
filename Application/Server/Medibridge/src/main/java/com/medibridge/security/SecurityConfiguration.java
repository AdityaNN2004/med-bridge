package com.medibridge.security;
import org.apache.catalina.util.SessionConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import com.medibridge.repository.DonarAddressRepository;
import lombok.RequiredArgsConstructor;

@Configuration //to declare java conffiguration class (equivalent to bean config xml)
@EnableWebSecurity //to enable spring web security
@EnableMethodSecurity // to enable method level annotation
@RequiredArgsConstructor //non null & final
public class SecurityConfiguration {

    private final DonarAddressRepository donarAddressRepository;
    private final PasswordEncoder passwordEncoder;
    private final CustomJwtFilter customJwtFilter;

  
  @Bean
  SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception
  {
	  httpSecurity.csrf(csrf -> csrf.disable());
	  
	  httpSecurity.authorizeHttpRequests(auth -> auth
	            .anyRequest().permitAll()
		        );
	  
	  httpSecurity.sessionManagement(
			  sessionConfig ->
			  sessionConfig.sessionCreationPolicy
			  (SessionCreationPolicy.STATELESS));
	  
//	  httpSecurity.httpBasic(httpBasic -> httpBasic.disable())
//      .formLogin(form -> form.disable());
//  
	  
//	  httpSecurity.authorizeHttpRequests( request ->
//	  request.requestMatchers("/swagger-ui/**",
//			  "/v3/api-docs/**",
//			  "/user/sign-in",
//			  "/admin/**",
//			  "/donar/sign-up",
//			  "/users/pwd-encryption"
//			  ).permitAll()
//	           .requestMatchers(HttpMethod.OPTIONS).permitAll()
//	           .requestMatchers("/donar/**").hasRole("DONAR")
//               .requestMatchers("/ngo/**").hasRole("NGO")
//               .requestMatchers("/admin/**").hasRole("ADMIN")
//	           .anyRequest().authenticated())
//	           .addFilterBefore(customJwtFilter, UsernamePasswordAuthenticationFilter.class);
//	  
	           return httpSecurity.build();  
  }
  
  @Bean
  AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception
  {
	  return config.getAuthenticationManager();
  }
}
