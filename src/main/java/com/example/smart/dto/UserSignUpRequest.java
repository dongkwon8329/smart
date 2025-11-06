package com.example.smart.dto;

// src/main/java/com/app/dto/UserSignUpRequest.java

import lombok.Data;
import lombok.Getter;
import lombok.Setter;


@Data
public class UserSignUpRequest {
    private String userId;
    private String name;
    private String password;
    private Integer age;
    private Double income;
    private Double goalAmount;
}
