package com.medibridge.security;

import java.lang.System.Logger;
import java.util.Date;
import java.util.Map;

import javax.crypto.SecretKey;

import org.apache.tomcat.util.security.PrivilegedSetTccl;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.medibridge.entities.User;

//import com.healthcare.entities.UserEntity;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;

@Component //Marks this class as a Spring bean.
@Slf4j //Provided by Lombok. Automatically creates a logger named log.
public class JwtUtils {
   //to inject a value in spring bean (value based di)
    @Value("${jwt.secret.key}") //spring expression language
    private String secretKey;
    @Value("${jwt.expiration.time}") //to inject exp time
    private long expTime;
    public SecretKey key; //symmetric secret key -- HMC_SHA256
  
    @PostConstruct //This method is called once, automatically After Spring creates the bean
    public void myInit()
    {
    	key = Keys.hmacShaKeyFor(secretKey.getBytes());
    	log.info("exp time {} key {}", expTime,key);
    }
    
    //genenrate token
     public String generateToken(User user)
     {
	    Date createdOnDate = new Date();
	    Date expDate = new Date(createdOnDate.getTime() + expTime);
	    return Jwts.builder()
	    		.subject(user.getEmail()) //set subject (issuer)
	    		.issuedAt(createdOnDate) //set issued at
	    		.expiration(expDate) //set exp date
	    		//payload -- custom claims
	    		.claims(Map.of("user_id", user.getId(),"role", user.getUserRole().name()))
	    		.signWith(key)
	    		.compact();  //generate token string
     }
     //validate token
     public Claims validateJWT(String jwt)
     {
    	 return Jwts.parser()
    			 .verifyWith(key)
    			 .build()
    			 .parseSignedClaims(jwt)
    			 .getPayload();
     }
	
}