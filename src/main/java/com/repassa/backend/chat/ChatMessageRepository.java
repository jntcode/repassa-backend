package com.repassa.backend.chat;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findByConversationIdOrderByCreatedAtAscIdAsc(Long conversationId);

    Optional<ChatMessage> findFirstByConversationIdOrderByCreatedAtDescIdDesc(Long conversationId);

    long countByConversationIdAndSenderIdNotAndReadFalse(Long conversationId, Long senderId);

    @Modifying
    @Query("""
            update ChatMessage m
               set m.read = true
             where m.conversation.id = :conversationId
               and m.sender.id <> :userId
               and m.read = false
            """)
    int markAsRead(@Param("conversationId") Long conversationId, @Param("userId") Long userId);
}
