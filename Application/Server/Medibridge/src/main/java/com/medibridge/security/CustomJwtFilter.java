package com.medibridge.security;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.medibridge.dtos.Jwtdto;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class CustomJwtFilter extends OncePerRequestFilter {
	private final JwtUtils jwtUtils;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		
		String headerValue = request.getHeader("Authorization");
		if (headerValue != null && headerValue.startsWith("Bearer ")) {
			String jwt = headerValue.substring(7);
			log.info("jwt found {} ", jwt);
			Claims claims = jwtUtils.validateJWT(jwt);
		
			String role = claims.get("role", String.class);
			Jwtdto dto=new Jwtdto(claims.get("user_id", Long.class),role);
			
			UsernamePasswordAuthenticationToken auth=new UsernamePasswordAuthenticationToken(dto, null,List.of(new SimpleGrantedAuthority(role)));
		
			SecurityContextHolder.getContext().setAuthentication(auth);
			log.info("add sec ctx ");
			
		}
		filterChain.doFilter(request, response);

	}

}
