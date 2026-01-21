package com.medibridge.service;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

public interface S3Service {
	 String uploadFile(MultipartFile file, String path) throws IOException;
}
