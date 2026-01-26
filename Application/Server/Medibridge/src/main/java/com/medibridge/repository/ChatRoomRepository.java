package com.medibridge.repository;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medibridge.entities.chat.ChatRoom;
import com.medibridge.entities.donar.Donar;
import com.medibridge.entities.ngo.Ngo;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    Optional<ChatRoom> findByNgoAndDonar(Ngo ngo, Donar donar);
}
