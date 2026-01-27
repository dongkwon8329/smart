package com.example.smart.controller;

import com.example.smart.entity.Saving;
import com.example.smart.model.UserSurvey;
import com.example.smart.service.RecommendService;
import com.example.smart.service.UserSurveyService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/survey")
@CrossOrigin(origins="http://localhost:3000") //React연결 허용
public class UserSurveyController {

    private final UserSurveyService service;
    private final RecommendService recommendService;

    public UserSurveyController(UserSurveyService service,RecommendService recommendService) {
        this.service = service;
        this.recommendService= recommendService;
    }

    @PostMapping("/submit")
    public UserSurvey submitSurvey(@RequestBody UserSurvey survey) {
        return service.saveSurvey(survey);

    }

    @GetMapping("/user/{userId}")
    public UserSurvey getSurvey(@PathVariable String userId) {
        return service.getSurveyByUserId(userId);
    }

    @GetMapping("/recommend/top3/{userId}")
    public List<Saving> recommendTop3(@PathVariable String userId) {
        UserSurvey survey = service.getSurveyByUserId(userId);
        return recommendService.getRecommendedProducts(survey);
    }
}


