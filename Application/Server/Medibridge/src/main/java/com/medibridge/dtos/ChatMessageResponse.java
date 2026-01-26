package com.medibridge.dtos;


import lombok.*;
import java.time.*;

@Getter
@Setter
@AllArgsConstructor
public class ChatMessageResponse {
    private Long messageId;
    private String message;
    private String senderType;
    private Long senderId;
    private boolean isRead;
    private LocalDate createdOn;
}