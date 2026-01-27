package com.example.smart.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSurveyDTO {
    private String userId;
    private String job;
    private Integer age;
    private Integer income;
    private String savingGoal;
    private Integer savingPeriod;
    private String riskPreference;
    private Integer financialKnowledge;
    private String preferredBank;
}