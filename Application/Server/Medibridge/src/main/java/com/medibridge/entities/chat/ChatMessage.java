package com.medibridge.entities.chat;

import com.medibridge.entities.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "chat_message")
@AttributeOverride(name = "id", column = @Column(name = "message_id"))
@NoArgsConstructor
@Getter
@Setter
@ToString
public class ChatMessage extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_room_id", nullable = false)
    private ChatRoom chatRoom;

    @Enumerated(EnumType.STRING)
    @Column(name = "sender_type", nullable = false)
    private SenderType senderType;

    @Column(name = "sender_id", nullable = false)
    private Long senderId;

    @Column(name = "message", columnDefinition = "TEXT", nullable = false)
    private String message;

    @Column(name = "is_read")
    private boolean read = false;

    public ChatMessage(ChatRoom chatRoom, SenderType senderType, Long senderId, String message) {
        this.chatRoom = chatRoom;
        this.senderType = senderType;
        this.senderId = senderId;
        this.message = message;
    }
}
