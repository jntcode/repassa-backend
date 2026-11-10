package com.repassa.backend.item;

import com.repassa.backend.auth.User;
import com.repassa.backend.auth.UserRepository;
import com.repassa.backend.category.Category;
import com.repassa.backend.category.CategoryRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ItemService {

    private final ItemRepository itemRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public ItemService(ItemRepository itemRepository, CategoryRepository categoryRepository,
                      UserRepository userRepository) {
        this.itemRepository = itemRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    public List<ItemDTO> findAll(Long userId) {
        return itemRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(ItemDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ItemDTO> findAllAvailable() {
        return itemRepository.findByAvailableTrueOrderByCreatedAtDesc()
                .stream()
                .map(ItemDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ItemDTO> findByCategory(Long categoryId) {
        return itemRepository.findByCategoryIdAndAvailableTrueOrderByCreatedAtDesc(categoryId)
                .stream()
                .map(ItemDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ItemDTO> findByCity(String city) {
        return itemRepository.findByCityContainingIgnoreCaseAndAvailableTrueOrderByCreatedAtDesc(city)
                .stream()
                .map(ItemDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public ItemDTO findById(Long id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Item not found"));
        return ItemDTO.fromEntity(item);
    }

    public ItemDTO createItem(ItemDTO dto, Long userId) {
        Item item = new Item();
        item.setTitle(dto.getTitle());
        item.setDescription(dto.getDescription());
        item.setCondition(dto.getCondition());
        item.setImageUrl(dto.getImageUrl());
        item.setCity(dto.getCity());
        item.setNeighborhood(dto.getNeighborhood());
        item.setAvailable(true);

        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new EntityNotFoundException("Category not found"));
            item.setCategory(category);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        item.setUser(user);

        Item saved = itemRepository.save(item);
        return ItemDTO.fromEntity(saved);
    }

    public ItemDTO updateItem(Long id, ItemDTO dto, Long userId) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Item not found"));

        if (!item.getUser().getId().equals(userId)) {
            throw new org.springframework.security.access.AccessDeniedException("Not authorized");
        }

        item.setTitle(dto.getTitle());
        item.setDescription(dto.getDescription());
        item.setCondition(dto.getCondition());
        item.setImageUrl(dto.getImageUrl());
        item.setCity(dto.getCity());
        item.setNeighborhood(dto.getNeighborhood());

        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new EntityNotFoundException("Category not found"));
            item.setCategory(category);
        } else {
            item.setCategory(null);
        }

        return ItemDTO.fromEntity(itemRepository.save(item));
    }

    public void deleteItem(Long id, Long userId) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Item not found"));

        if (!item.getUser().getId().equals(userId)) {
            throw new org.springframework.security.access.AccessDeniedException("Not authorized");
        }

        itemRepository.deleteById(id);
    }

    public ItemDTO markUnavailable(Long id, Long userId) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Item not found"));

        if (!item.getUser().getId().equals(userId)) {
            throw new org.springframework.security.access.AccessDeniedException("Not authorized");
        }

        item.setAvailable(false);
        return ItemDTO.fromEntity(itemRepository.save(item));
    }
}
