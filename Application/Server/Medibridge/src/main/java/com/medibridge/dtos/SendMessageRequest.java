package com.medibridge.dtos;
import com.medibridge.entities.chat.SenderType;
import lombok.*;

@Getter
@Setter
public class SendMessageRequest {
    private Long ngoId;
    private Long donarId;
    private SenderType senderType;
    private Long senderId;
    private String message;
}