/*package com.example.smart.repository;

import com.example.smart.model.UserSurvey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserSurveyRepository extends JpaRepository<UserSurvey, Long> {
    Optional findByUserId(Long userId);
}*/

package com.example.smart.repository;

import com.example.smart.model.UserSurvey;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface UserSurveyRepository extends JpaRepository<UserSurvey, String> {
    //같은 user_id의 설문조사 결과가 여러개여도 가장 최신꺼 출력
    UserSurvey findTopByUserIdOrderBySurveyIdDesc(String userId);



}



