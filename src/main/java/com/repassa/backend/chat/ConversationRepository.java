package com.repassa.backend.chat;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    Optional<Conversation> findByItemIdAndInterestedUserId(Long itemId, Long interestedUserId);
    List<Conversation> findByAnnouncerIdOrInterestedUserIdOrderByLastMessageAtDesc(Long announcerId, Long interestedUserId);
}
