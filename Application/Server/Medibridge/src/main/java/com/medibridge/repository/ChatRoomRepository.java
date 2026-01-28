package com.medibridge.repository;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.medibridge.entities.Donations;
import com.medibridge.entities.chat.ChatRoom;
import com.medibridge.entities.donar.Donar;
import com.medibridge.entities.ngo.Ngo;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    Optional<ChatRoom> findByNgoAndDonar(Ngo ngo, Donar donar);
    
    @Query(value = "select * from chat_room where donar_id =:donarId and ngo_id =:ngoId", nativeQuery = true)
    ChatRoom CheckIfChatRoomExist(@Param("ngoId") Long ngo_id, @Param("donarId") Long donar_id);
  
}
