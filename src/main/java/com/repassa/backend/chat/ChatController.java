package com.repassa.backend.chat;

import com.repassa.backend.auth.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    private Long getCurrentUserId() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return user.getId();
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationDTO>> getMyConversations() {
        return ResponseEntity.ok(chatService.findMyConversations(getCurrentUserId()));
    }

    @PostMapping("/conversations")
    public ResponseEntity<ConversationDTO> startConversation(@RequestBody StartConversationRequest request) {
        return ResponseEntity.ok(chatService.startConversation(
                request.getItemId(), request.getMessage(), getCurrentUserId()));
    }

    @GetMapping("/conversations/{id}")
    public ResponseEntity<ConversationDTO> getConversation(@PathVariable Long id) {
        return ResponseEntity.ok(chatService.findById(id, getCurrentUserId()));
    }

    @GetMapping("/conversations/{id}/messages")
    public ResponseEntity<List<ChatMessageDTO>> getMessages(@PathVariable Long id) {
        return ResponseEntity.ok(chatService.findMessages(id, getCurrentUserId()));
    }

    @PostMapping("/conversations/{id}/messages")
    public ResponseEntity<ChatMessageDTO> sendMessage(@PathVariable Long id, @RequestBody SendMessageRequest request) {
        return ResponseEntity.ok(chatService.sendMessage(id, request.getContent(), getCurrentUserId()));
    }

    @PutMapping("/conversations/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        chatService.markAsRead(id, getCurrentUserId());
        return ResponseEntity.noContent().build();
    }
}
