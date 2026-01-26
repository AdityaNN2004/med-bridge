package com.medibridge.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.medibridge.dtos.SendMessageRequest;
import com.medibridge.dtos.ChatMessageResponse;
import com.medibridge.entities.chat.ChatMessage;
import com.medibridge.entities.chat.ChatRoom;
import com.medibridge.entities.donar.Donar;
import com.medibridge.entities.ngo.Ngo;
import com.medibridge.repository.ChatMessageRepository;
import com.medibridge.repository.ChatRoomRepository;
import com.medibridge.repository.DonarRepository;
import com.medibridge.repository.NgoRepository;

@Service
@Transactional
public class ChatService {

    private final ChatRoomRepository chatRoomRepo;
    private final ChatMessageRepository chatMessageRepo;
    private final NgoRepository ngoRepo;
    private final DonarRepository donarRepo;

    public ChatService(ChatRoomRepository chatRoomRepo,
                       ChatMessageRepository chatMessageRepo,
                       NgoRepository ngoRepo,
                       DonarRepository donarRepo) {
        this.chatRoomRepo = chatRoomRepo;
        this.chatMessageRepo = chatMessageRepo;
        this.ngoRepo = ngoRepo;
        this.donarRepo = donarRepo;
    }

    public void sendMessage(SendMessageRequest request) {

        Ngo ngo = ngoRepo.findById(request.getNgoId())
                .orElseThrow(() -> new RuntimeException("NGO not found"));

        Donar donar = donarRepo.findById(request.getDonarId())
                .orElseThrow(() -> new RuntimeException("Donor not found"));

        ChatRoom chatRoom = chatRoomRepo
                .findByNgoAndDonar(ngo, donar)
                .orElseGet(() -> chatRoomRepo.save(new ChatRoom(ngo, donar)));

        ChatMessage message = new ChatMessage(
                chatRoom,
                request.getSenderType(),
                request.getSenderId(),
                request.getMessage()
        );

        chatMessageRepo.save(message);
    }

    public List<ChatMessageResponse> getChatMessages(Long ngoId, Long donarId) {

        Ngo ngo = ngoRepo.findById(ngoId)
                .orElseThrow(() -> new RuntimeException("NGO not found"));

        Donar donar = donarRepo.findById(donarId)
                .orElseThrow(() -> new RuntimeException("Donor not found"));

        ChatRoom chatRoom = chatRoomRepo
                .findByNgoAndDonar(ngo, donar)
                .orElseThrow(() -> new RuntimeException("Chat not found"));

        return chatMessageRepo
                .findByChatRoomOrderByCreatedOnAsc(chatRoom)
                .stream()
                .map(m -> new ChatMessageResponse(
                        m.getId(),
                        m.getMessage(),
                        m.getSenderType().name(),
                        m.getSenderId(),
                        m.isRead(),
                        m.getCreatedOn()
                ))
                .collect(Collectors.toList());
    }
}
