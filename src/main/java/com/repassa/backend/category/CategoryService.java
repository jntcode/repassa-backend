package com.repassa.backend.category;

import com.repassa.backend.auth.User;
import com.repassa.backend.auth.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public CategoryService(CategoryRepository categoryRepository, UserRepository userRepository) {
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    public List<CategoryDTO> findAll(Long userId) {
        return categoryRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(CategoryDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public CategoryDTO findById(Long id, Long userId) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Category not found"));

        if (!category.getUser().getId().equals(userId)) {
            throw new org.springframework.security.access.AccessDeniedException("Not authorized");
        }

        return CategoryDTO.fromEntity(category);
    }

    public CategoryDTO createCategory(CategoryDTO dto, Long userId) {
        Category category = new Category();
        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        category.setIcon(dto.getIcon());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        category.setUser(user);

        Category saved = categoryRepository.save(category);
        return CategoryDTO.fromEntity(saved);
    }

    public CategoryDTO updateCategory(Long id, CategoryDTO dto, Long userId) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Category not found"));

        if (!category.getUser().getId().equals(userId)) {
            throw new org.springframework.security.access.AccessDeniedException("Not authorized");
        }

        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        category.setIcon(dto.getIcon());

        return CategoryDTO.fromEntity(categoryRepository.save(category));
    }

    public void deleteCategory(Long id, Long userId) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Category not found"));

        if (!category.getUser().getId().equals(userId)) {
            throw new org.springframework.security.access.AccessDeniedException("Not authorized");
        }

        categoryRepository.deleteById(id);
    }
}
