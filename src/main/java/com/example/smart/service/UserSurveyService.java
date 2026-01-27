package com.example.smart.service;

import com.example.smart.model.UserSurvey;
import com.example.smart.repository.UserSurveyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserSurveyService {

    private final UserSurveyRepository userSurveyRepository;



    public UserSurvey saveSurvey(UserSurvey survey) {
        return userSurveyRepository.save(survey);
    }

    public UserSurvey getSurveyByUserId(String userId) {
        return userSurveyRepository.findTopByUserIdOrderBySurveyIdDesc(userId);
    }
}

