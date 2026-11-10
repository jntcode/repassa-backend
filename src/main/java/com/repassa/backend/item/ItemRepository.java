package com.repassa.backend.item;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    @Query("""
            select i from Item i
             where i.available = true
               and (:keyword is null
                    or lower(i.title) like lower(concat('%', :keyword, '%'))
                    or lower(coalesce(i.description, '')) like lower(concat('%', :keyword, '%')))
               and (:city is null or lower(coalesce(i.city, '')) like lower(concat('%', :city, '%')))
               and (:neighborhood is null or lower(coalesce(i.neighborhood, '')) like lower(concat('%', :neighborhood, '%')))
               and (:categoryId is null or i.category.id = :categoryId)
               and (:condition is null or lower(i.condition) = lower(:condition))
             order by i.createdAt desc
            """)
    List<Item> searchAvailable(@Param("keyword") String keyword,
                               @Param("city") String city,
                               @Param("neighborhood") String neighborhood,
                               @Param("categoryId") Long categoryId,
                               @Param("condition") String condition);
}
