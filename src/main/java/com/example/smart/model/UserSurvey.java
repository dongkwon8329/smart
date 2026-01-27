package com.example.smart.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Entity
@Table(name = "USER_SURVEY")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSurvey {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long surveyId;

    @Column(nullable = false)
    private String userId;

    private String job;
    private Integer age;
    private Integer income;
    private String savingGoal;
    private Integer savingPeriod;
    private String riskPreference;
    private Integer financialKnowledge;
    private String preferredBank;

    @Temporal(TemporalType.TIMESTAMP)
    private java.util.Date createdAt=new java.util.Date();
}
