package com.repassa.backend.item;

import com.repassa.backend.auth.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ItemController {

    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    private Long getCurrentUserId() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return user.getId();
    }

    @GetMapping("/items")
    public ResponseEntity<List<ItemDTO>> getAllMyItems() {
        return ResponseEntity.ok(itemService.findAll(getCurrentUserId()));
    }

    @GetMapping("/items/all")
    public ResponseEntity<List<ItemDTO>> getAllAvailableItems() {
        return ResponseEntity.ok(itemService.findAllAvailable());
    }

    @GetMapping("/items/{id}")
    public ResponseEntity<ItemDTO> getItemById(@PathVariable Long id) {
        return ResponseEntity.ok(itemService.findById(id));
    }

    @GetMapping("/items/category/{categoryId}")
    public ResponseEntity<List<ItemDTO>> getItemsByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(itemService.findByCategory(categoryId));
    }

    @GetMapping("/items/city/{city}")
    public ResponseEntity<List<ItemDTO>> getItemsByCity(@PathVariable String city) {
        return ResponseEntity.ok(itemService.findByCity(city));
    }

    @PostMapping("/items")
    public ResponseEntity<ItemDTO> createItem(@RequestBody ItemDTO dto) {
        return ResponseEntity.ok(itemService.createItem(dto, getCurrentUserId()));
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<ItemDTO> updateItem(@PathVariable Long id, @RequestBody ItemDTO dto) {
        return ResponseEntity.ok(itemService.updateItem(id, dto, getCurrentUserId()));
    }

    @PutMapping("/items/{id}/unavailable")
    public ResponseEntity<ItemDTO> markUnavailable(@PathVariable Long id) {
        return ResponseEntity.ok(itemService.markUnavailable(id, getCurrentUserId()));
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        itemService.deleteItem(id, getCurrentUserId());
        return ResponseEntity.noContent().build();
    }
}
