package com.example.smart.service;

import com.example.smart.service.RecommendService;
import com.example.smart.service.UserSurveyService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

import java.time.Duration;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final RecommendService recommendService;
    private final UserSurveyService userSurveyService;
    private final WebClient webClient; // WebClient 객체 주입

    @Value("${OPENAI_API_KEY}")
    private String openAiApiKey;

    @Value("${openai.api.url}")
    private String openAiApiUrl;

    public String chatWithGPT(String userMessage, String userId) {

        // --- 재시도 설정 ---
        // 429 에러 발생 시 최대 3번 재시도하며, 2초 후에 시작
        Retry retryPolicy = Retry.fixedDelay(3, Duration.ofSeconds(2))
                // 429 상태 코드일 때만 재시도 로직을 실행하도록 필터링
                .filter(this::isTooManyRequestsError)
                .onRetryExhaustedThrow((retryBackoffSpec, retrySignal) -> {
                    // 최종 시도까지 실패하면 RuntimeException 발생
                    throw new RuntimeException("OpenAI API 호출 실패: 최대 재시도 횟수 초과", retrySignal.failure());
                });

        try {
            // ① 사용자 설문 결과 기반 추천 적금상품
            var survey = userSurveyService.getSurveyByUserId(userId);
            var recommended = recommendService.getRecommendedProducts(survey);


            // ② 금융전문 상담 모드 System Prompt
            String systemPrompt = """
            당신은 금융전문 상담 AI입니다.
            사용자의 질문에 대해 예금, 적금, 금리, 재테크, 금융상품 관련 전문적이고도 친절한 답변을 제공합니다.
            너무 어려운 용어는 피하고, 이해하기 쉽게 풀어서 설명하세요.
            필요할 경우 예시를 들어주세요.
            """;

            // ③ 추천 상품 정보 문자열로 변환
            StringBuilder productInfo = new StringBuilder("\n\n[추천된 적금 상품 목록]\n");
            for (var p : recommended) {
                productInfo.append(String.format("- %s (%s개월, 금리 %.2f%%)\n",
                        p.getProductName(), p.getPeriod(), p.getInterestRate()));
            }

            // ④ OpenAI API 요청 본문 구성
            Map<String, Object> requestBody = Map.of(
                    "model", "gpt-4o-mini",
                    "messages", List.of(
                            Map.of("role", "system", "content", systemPrompt),
                            Map.of("role", "user", "content", userMessage + productInfo)
                    )
            );

            // ⑤ WebClient를 사용하여 API 호출 및 재시도 적용
            Map responseBody = webClient.post()
                    .uri(openAiApiUrl)
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + openAiApiKey)
                    .body(BodyInserters.fromValue(requestBody))
                    .retrieve()
                    .bodyToMono(Map.class)
                    .retryWhen(retryPolicy) // 👈 재시도 로직 적용
                    .block();

            // ⑥ 응답 파싱
            List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");

            return (String) message.get("content");

        } catch (Exception e) {
            e.printStackTrace();
            return "⚠️ AI 상담 중 오류가 발생했습니다. 다시 시도해주세요.";
        }
    }

    /**
     * 429 Too Many Requests 에러인지 확인하는 헬퍼 메서드
     */
    private boolean isTooManyRequestsError(Throwable throwable) {
        return throwable instanceof WebClientResponseException &&
                ((WebClientResponseException) throwable).getStatusCode() == HttpStatus.TOO_MANY_REQUESTS;
    }
}