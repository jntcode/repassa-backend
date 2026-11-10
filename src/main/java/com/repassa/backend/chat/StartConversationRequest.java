package com.repassa.backend.chat;

import jakarta.validation.constraints.NotNull;

public class StartConversationRequest {

    @NotNull(message = "Item is required")
    private Long itemId;

    private String message;

    public StartConversationRequest() {
    }

    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
