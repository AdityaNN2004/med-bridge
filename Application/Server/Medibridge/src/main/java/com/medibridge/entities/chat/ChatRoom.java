package com.medibridge.entities.chat;

import com.medibridge.entities.BaseEntity;
import com.medibridge.entities.donar.Donar;
import com.medibridge.entities.ngo.Ngo;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "chat_room",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"ngo_id", "donar_id"})
    }
)
@AttributeOverride(name = "id", column = @Column(name = "chat_room_id"))
@NoArgsConstructor
@Getter
@Setter
@ToString
public class ChatRoom extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "ngo_id", nullable = false)
    private Ngo ngo;

    @ManyToOne
    @JoinColumn(name = "donar_id", nullable = false)
    private Donar donar;

    public ChatRoom(Ngo ngo, Donar donar) {
        this.ngo = ngo;
        this.donar = donar;
    }
}
