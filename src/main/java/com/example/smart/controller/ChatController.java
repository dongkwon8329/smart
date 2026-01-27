package com.example.smart.controller;

import com.example.smart.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    public String chat(@RequestBody Map<String, Object> payload) {
        try {
            String userId = String.valueOf(payload.get("userId").toString());
            String message = payload.get("message").toString();

            System.out.println("🧠 Chat Request - userId: " + userId + ", message: " + message);

            String response = chatService.chatWithGPT(message, userId);
            return response;

        } catch (Exception e) {
            e.printStackTrace();
            return "⚠️ AI 상담 중 오류가 발생했습니다. 다시 시도해주세요.";
        }
    }
}
