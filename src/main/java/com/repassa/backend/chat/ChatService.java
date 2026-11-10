package com.repassa.backend.chat;

import com.repassa.backend.auth.User;
import com.repassa.backend.auth.UserRepository;
import com.repassa.backend.item.Item;
import com.repassa.backend.item.ItemRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private static final int MAX_MESSAGE_LENGTH = 1000;

    private final ConversationRepository conversationRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;

    public ChatService(ConversationRepository conversationRepository,
                       ChatMessageRepository chatMessageRepository,
                       ItemRepository itemRepository,
                       UserRepository userRepository) {
        this.conversationRepository = conversationRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
    }

    public List<ConversationDTO> findMyConversations(Long userId) {
        return conversationRepository
                .findByAnnouncerIdOrInterestedUserIdOrderByLastMessageAtDesc(userId, userId)
                .stream()
                .map(conversation -> toDTO(conversation, userId))
                .collect(Collectors.toList());
    }

    public ConversationDTO findById(Long id, Long userId) {
        return toDTO(getConversationForUser(id, userId), userId);
    }

    public ConversationDTO startConversation(Long itemId, String message, Long userId) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new EntityNotFoundException("Item not found"));

        if (item.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You cannot start a conversation about your own item");
        }

        User interestedUser = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Conversation conversation = ensureConversation(item, interestedUser);

        if (message != null && !message.isBlank()) {
            sendMessage(conversation.getId(), message, userId);
        }

        return toDTO(conversation, userId);
    }

    /**
     * Returns the conversation between an item owner and an interested user,
     * creating it when it does not exist yet.
     */
    public Conversation ensureConversation(Item item, User interestedUser) {
        return conversationRepository
                .findByItemIdAndInterestedUserId(item.getId(), interestedUser.getId())
                .orElseGet(() -> {
                    Conversation conversation = new Conversation();
                    conversation.setItem(item);
                    conversation.setAnnouncer(item.getUser());
                    conversation.setInterestedUser(interestedUser);
                    return conversationRepository.save(conversation);
                });
    }

    @Transactional
    public List<ChatMessageDTO> findMessages(Long conversationId, Long userId) {
        Conversation conversation = getConversationForUser(conversationId, userId);
        chatMessageRepository.markAsRead(conversation.getId(), userId);
        return chatMessageRepository.findByConversationIdOrderByCreatedAtAscIdAsc(conversation.getId())
                .stream()
                .map(ChatMessageDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public ChatMessageDTO sendMessage(Long conversationId, String content, Long userId) {
        if (content == null || content.isBlank()) {
            throw new IllegalArgumentException("Message cannot be empty");
        }
        if (content.length() > MAX_MESSAGE_LENGTH) {
            throw new IllegalArgumentException("Message is too long (max " + MAX_MESSAGE_LENGTH + " characters)");
        }

        Conversation conversation = getConversationForUser(conversationId, userId);
        User sender = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        ChatMessage message = new ChatMessage();
        message.setConversation(conversation);
        message.setSender(sender);
        message.setContent(content.trim());
        message.setRead(false);

        ChatMessage saved = chatMessageRepository.save(message);

        conversation.setLastMessageAt(saved.getCreatedAt());
        conversationRepository.save(conversation);

        return ChatMessageDTO.fromEntity(saved);
    }

    @Transactional
    public int markAsRead(Long conversationId, Long userId) {
        getConversationForUser(conversationId, userId);
        return chatMessageRepository.markAsRead(conversationId, userId);
    }

    private Conversation getConversationForUser(Long id, Long userId) {
        Conversation conversation = conversationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Conversation not found"));

        if (!conversation.getAnnouncer().getId().equals(userId)
                && !conversation.getInterestedUser().getId().equals(userId)) {
            throw new AccessDeniedException("Not authorized");
        }

        return conversation;
    }

    private ConversationDTO toDTO(Conversation conversation, Long userId) {
        ChatMessage lastMessage = chatMessageRepository
                .findFirstByConversationIdOrderByCreatedAtDescIdDesc(conversation.getId())
                .orElse(null);
        long unreadCount = chatMessageRepository
                .countByConversationIdAndSenderIdNotAndReadFalse(conversation.getId(), userId);
        return ConversationDTO.fromEntity(conversation, userId, lastMessage, unreadCount);
    }
}
