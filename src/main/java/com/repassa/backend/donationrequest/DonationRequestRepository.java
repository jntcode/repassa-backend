package com.repassa.backend.donationrequest;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DonationRequestRepository extends JpaRepository<DonationRequest, Long> {
    List<DonationRequest> findByOwnerIdOrderByCreatedAtDesc(Long ownerId);
    List<DonationRequest> findByRequesterIdOrderByCreatedAtDesc(Long requesterId);
    List<DonationRequest> findByItemIdAndOwnerId(Long itemId, Long ownerId);
    long countByOwnerId(Long ownerId);
    long countByOwnerIdAndStatus(Long ownerId, DonationRequestStatus status);
}
