package com.medibridge.service;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
public class S3ConnectionTest {

    @Bean
    CommandLineRunner testS3Connection(S3Client s3Client) {
        return args -> {
            try {
                s3Client.listBuckets().buckets().forEach(
                    b -> System.out.println(" S3 Bucket Found: " + b.name())
                );
                System.out.println("Successfully connected to AWS S3");
            } catch (Exception e) {
                System.err.println("Failed to connect to S3");
                e.printStackTrace();
            }
        };
    }
}
