package com.repassa.backend.chat;

import com.repassa.backend.auth.User;
import java.time.LocalDateTime;

public class ConversationDTO {

    private Long id;
    private Long itemId;
    private String itemTitle;
    private String itemImageUrl;
    private String itemCity;
    private Long announcerId;
    private String announcerName;
    private Long interestedUserId;
    private String interestedUserName;
    private Long otherUserId;
    private String otherUserName;
    private String lastMessage;
    private LocalDateTime lastMessageAt;
    private long unreadCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ConversationDTO() {
    }

    public static ConversationDTO fromEntity(Conversation conversation, Long currentUserId,
                                              ChatMessage lastMessage, long unreadCount) {
        ConversationDTO dto = new ConversationDTO();
        dto.setId(conversation.getId());
        dto.setItemId(conversation.getItem().getId());
        dto.setItemTitle(conversation.getItem().getTitle());
        dto.setItemImageUrl(conversation.getItem().getImageUrl());
        dto.setItemCity(conversation.getItem().getCity());
        dto.setAnnouncerId(conversation.getAnnouncer().getId());
        dto.setAnnouncerName(conversation.getAnnouncer().getName());
        dto.setInterestedUserId(conversation.getInterestedUser().getId());
        dto.setInterestedUserName(conversation.getInterestedUser().getName());

        User other = conversation.getAnnouncer().getId().equals(currentUserId)
                ? conversation.getInterestedUser()
                : conversation.getAnnouncer();
        dto.setOtherUserId(other.getId());
        dto.setOtherUserName(other.getName());

        dto.setLastMessage(lastMessage != null ? lastMessage.getContent() : null);
        dto.setLastMessageAt(conversation.getLastMessageAt());
        dto.setUnreadCount(unreadCount);
        dto.setCreatedAt(conversation.getCreatedAt());
        dto.setUpdatedAt(conversation.getUpdatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public String getItemTitle() {
        return itemTitle;
    }

    public void setItemTitle(String itemTitle) {
        this.itemTitle = itemTitle;
    }

    public String getItemImageUrl() {
        return itemImageUrl;
    }

    public void setItemImageUrl(String itemImageUrl) {
        this.itemImageUrl = itemImageUrl;
    }

    public String getItemCity() {
        return itemCity;
    }

    public void setItemCity(String itemCity) {
        this.itemCity = itemCity;
    }

    public Long getAnnouncerId() {
        return announcerId;
    }

    public void setAnnouncerId(Long announcerId) {
        this.announcerId = announcerId;
    }

    public String getAnnouncerName() {
        return announcerName;
    }

    public void setAnnouncerName(String announcerName) {
        this.announcerName = announcerName;
    }

    public Long getInterestedUserId() {
        return interestedUserId;
    }

    public void setInterestedUserId(Long interestedUserId) {
        this.interestedUserId = interestedUserId;
    }

    public String getInterestedUserName() {
        return interestedUserName;
    }

    public void setInterestedUserName(String interestedUserName) {
        this.interestedUserName = interestedUserName;
    }

    public Long getOtherUserId() {
        return otherUserId;
    }

    public void setOtherUserId(Long otherUserId) {
        this.otherUserId = otherUserId;
    }

    public String getOtherUserName() {
        return otherUserName;
    }

    public void setOtherUserName(String otherUserName) {
        this.otherUserName = otherUserName;
    }

    public String getLastMessage() {
        return lastMessage;
    }

    public void setLastMessage(String lastMessage) {
        this.lastMessage = lastMessage;
    }

    public LocalDateTime getLastMessageAt() {
        return lastMessageAt;
    }

    public void setLastMessageAt(LocalDateTime lastMessageAt) {
        this.lastMessageAt = lastMessageAt;
    }

    public long getUnreadCount() {
        return unreadCount;
    }

    public void setUnreadCount(long unreadCount) {
        this.unreadCount = unreadCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
