package com.example.smart.service;

import com.example.smart.entity.Saving;
import com.example.smart.model.UserSurvey;
import com.example.smart.repository.SavingRepository; // 👈 ProductRepository -> SavingRepository로 변경
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendService {

    // 👈 의존성 주입 대상을 ProductRepository -> SavingRepository로 변경
    private final SavingRepository savingRepository;

    public List<Saving> getRecommendedProducts(UserSurvey survey) {

        // 👈 사용하는 Repository도 savingRepository로 변경
        List<Saving> all = savingRepository.findAll();

        return all.stream()
                .sorted((a, b) -> score(b, survey) - score(a, survey))
                .limit(3)
                .toList();
    }

    private int score(Saving p, UserSurvey s) {
        int score = 0;

        // 기간이 survey와 가까울수록 높은 점수
        score -= Math.abs(p.getPeriod() - s.getSavingPeriod());

        // 금리는 높을수록 점수 +
        score += (int)(p.getInterestRate() * 10);

        return score;
    }
}