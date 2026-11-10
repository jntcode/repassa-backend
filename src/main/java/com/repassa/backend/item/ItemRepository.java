package com.repassa.backend.item;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    List<Item> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Item> findByAvailableTrueOrderByCreatedAtDesc();
    List<Item> findByCategoryIdAndAvailableTrueOrderByCreatedAtDesc(Long categoryId);
    List<Item> findByCityContainingIgnoreCaseAndAvailableTrueOrderByCreatedAtDesc(String city);
    long countByUserId(Long userId);
    long countByUserIdAndAvailableTrue(Long userId);
}
