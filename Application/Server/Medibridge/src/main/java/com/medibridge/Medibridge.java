package com.medibridge;
import org.modelmapper.Conditions;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import lombok.extern.slf4j.*;


@SpringBootApplication(scanBasePackages = "com.medibridge")
@Slf4j
public class Medibridge {

	public static void main(String[] args) {
		SpringApplication.run(Medibridge.class, args);
	}
	
	@Bean
	ModelMapper modelMapper()
	{
		ModelMapper mapper = new ModelMapper();
		mapper.getConfiguration()
		.setMatchingStrategy(MatchingStrategies.STRICT)
		.setPropertyCondition(Conditions.isNotNull());
		return mapper;		
	}
	
	@Bean
	PasswordEncoder passwordEncoder()
	{
		log.info("**** creating password encoder ****");
		return new BCryptPasswordEncoder();
	}
}
