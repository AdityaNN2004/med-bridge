package com.medibridge.controller;

import java.security.PrivateKey;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medibridge.entities.donar.Donar;
import com.medibridge.dtos.DonarDto;
import com.medibridge.service.AdminService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/admin")
public class AdminController {
    @Autowired
	private AdminService adminService;
	
	@PostMapping("/getalldonars")
	public List<DonarDto> getAllDonars()
	{
	     return adminService.getAllDonars();
	}
}