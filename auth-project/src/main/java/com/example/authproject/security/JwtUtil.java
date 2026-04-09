package com.example.authproject.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    private static final String SECRET =
            "authproject_secret_key_authproject_secret_key";

    private final SecretKey KEY =
            Keys.hmacShaKeyFor(SECRET.getBytes());

    // ✅ GENERATE TOKEN
    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(System.currentTimeMillis() + 86400000) // 1 day
                )
                .signWith(KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    // ✅ EXTRACT EMAIL
    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    // ✅ VALIDATE TOKEN (THIS WAS MISSING)
    public boolean validateToken(String token, UserDetails userDetails) {
        final String email = extractEmail(token);
        return email.equals(userDetails.getUsername());
    }

    // ------------------ HELPERS ------------------

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
