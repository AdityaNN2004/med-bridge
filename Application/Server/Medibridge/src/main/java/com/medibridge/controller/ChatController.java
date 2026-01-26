package com.medibridge.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.medibridge.dtos.*;
import com.medibridge.service.ChatService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
@CrossOrigin
public class ChatController {

    private final ChatService chatService;

    // ✅ Send Message
    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody SendMessageRequest request) {
        chatService.sendMessage(request);
        return ResponseEntity.ok("Message sent successfully");
    }

    // ✅ Fetch Chat Messages
    @GetMapping
    public ResponseEntity<List<ChatMessageResponse>> getMessages(
            @RequestParam Long ngoId,
            @RequestParam Long donarId
    ) {
        return ResponseEntity.ok(
                chatService.getChatMessages(ngoId, donarId)
        );
    }
}
