package com.medibridge.service;

import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.medibridge.entities.User;
import com.medibridge.custom_exceptions.AuthenticationException;
import com.medibridge.dtos.ApiResponse;
import com.medibridge.dtos.AuthRequest;
import com.medibridge.dtos.AuthResponse;
import com.medibridge.dtos.DonationDto;
import com.medibridge.repository.UserRepository;
import jakarta.transaction.Transactional;
@Service
@Transactional
public class UserServiceImpl implements UserService{

	@Autowired 
	private UserRepository userRepository;
	@Autowired
	private ModelMapper modelMapper;
	@Override
	public AuthResponse authenticateUser(AuthRequest dto) {
		User user = userRepository.findByEmailAndPassword(dto.getEmail(), dto.getPassword()).orElseThrow(() -> new AuthenticationException("Invalid Email or password !!!!!!"));
		
		AuthResponse responseDto = modelMapper.map(user, AuthResponse.class);
	    return responseDto;
	}
	@Override
	public ApiResponse AddToDonations(DonationDto donationdto) {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	public ApiResponse changeDonationStatusToComplete() {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	public ApiResponse changeDonationStatusToPending() {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	public ApiResponse changeDonationStatusToDiscarded() {
		// TODO Auto-generated method stub
		return null;
	}

}
