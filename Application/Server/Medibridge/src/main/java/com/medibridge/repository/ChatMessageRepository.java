package com.medibridge.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medibridge.entities.chat.ChatMessage;
import com.medibridge.entities.chat.ChatRoom;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findByChatRoomOrderByCreatedOnAsc(ChatRoom chatRoom);
}
