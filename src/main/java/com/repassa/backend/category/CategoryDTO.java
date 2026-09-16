package com.repassa.backend.category;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class CategoryDTO {

    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    private String description;
    private String icon;
    private LocalDateTime createdAt;

    public CategoryDTO() {
    }

    public CategoryDTO(Long id, String name, String description, String icon, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.icon = icon;
        this.createdAt = createdAt;
    }

    public static CategoryDTO fromEntity(Category category) {
        return new CategoryDTO(
                category.getId(),
                category.getName(),
                category.getDescription(),
                category.getIcon(),
                category.getCreatedAt()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
