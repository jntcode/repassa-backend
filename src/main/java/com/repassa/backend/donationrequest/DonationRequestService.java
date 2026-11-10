package com.repassa.backend.donationrequest;

import com.repassa.backend.auth.User;
import com.repassa.backend.auth.UserRepository;
import com.repassa.backend.chat.ChatService;
import com.repassa.backend.item.Item;
import com.repassa.backend.item.ItemRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DonationRequestService {

    private final DonationRequestRepository donationRequestRepository;
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;
    private final ChatService chatService;

    public DonationRequestService(DonationRequestRepository donationRequestRepository,
                                  ItemRepository itemRepository, UserRepository userRepository,
                                  ChatService chatService) {
        this.donationRequestRepository = donationRequestRepository;
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
        this.chatService = chatService;
    }

    public List<DonationRequestDTO> findMyReceivedRequests(Long userId) {
        return donationRequestRepository.findByOwnerIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(DonationRequestDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<DonationRequestDTO> findMySentRequests(Long userId) {
        return donationRequestRepository.findByRequesterIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(DonationRequestDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public DonationRequestDTO findById(Long id, Long userId) {
        DonationRequest request = donationRequestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Donation request not found"));

        if (!request.getOwner().getId().equals(userId) && !request.getRequester().getId().equals(userId)) {
            throw new org.springframework.security.access.AccessDeniedException("Not authorized");
        }

        return DonationRequestDTO.fromEntity(request);
    }

    public DonationRequestDTO createRequest(DonationRequestDTO dto, Long userId) {
        Item item = itemRepository.findById(dto.getItemId())
                .orElseThrow(() -> new EntityNotFoundException("Item not found"));

        if (!item.getAvailable()) {
            throw new IllegalArgumentException("Item is no longer available");
        }

        if (item.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You cannot request your own item");
        }

        List<DonationRequest> existing = donationRequestRepository
                .findByItemIdAndOwnerId(dto.getItemId(), userId);
        if (!existing.isEmpty()) {
            throw new IllegalArgumentException("You already requested this item");
        }

        DonationRequestType type = resolveType(dto.getType());

        User requester = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        DonationRequest request = new DonationRequest();
        request.setItem(item);
        request.setRequester(requester);
        request.setOwner(item.getUser());
        request.setType(type);
        request.setMessage(dto.getMessage());

        if (type == DonationRequestType.TRADE) {
            request.setOfferedItem(resolveOfferedItem(dto.getOfferedItemId(), userId));
        }

        DonationRequest saved = donationRequestRepository.save(request);

        // The use case "Solicitar doacao ou troca" includes chatting with the announcer.
        chatService.ensureConversation(item, requester);

        return DonationRequestDTO.fromEntity(saved);
    }

    private DonationRequestType resolveType(String type) {
        if (type == null || type.isBlank()) {
            return DonationRequestType.DONATION;
        }
        try {
            return DonationRequestType.valueOf(type.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid request type: " + type);
        }
    }

    private Item resolveOfferedItem(Long offeredItemId, Long userId) {
        if (offeredItemId == null) {
            throw new IllegalArgumentException("An offered item is required for a trade request");
        }

        Item offeredItem = itemRepository.findById(offeredItemId)
                .orElseThrow(() -> new EntityNotFoundException("Offered item not found"));

        if (!offeredItem.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You can only offer your own items");
        }

        if (!offeredItem.getAvailable()) {
            throw new IllegalArgumentException("The offered item is no longer available");
        }

        return offeredItem;
    }

    public DonationRequestDTO acceptRequest(Long id, Long userId) {
        DonationRequest request = donationRequestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Donation request not found"));

        if (!request.getOwner().getId().equals(userId)) {
            throw new org.springframework.security.access.AccessDeniedException("Not authorized");
        }

        request.setStatus(DonationRequestStatus.ACCEPTED);
        request.getItem().setAvailable(false);

        if (request.getType() == DonationRequestType.TRADE && request.getOfferedItem() != null) {
            request.getOfferedItem().setAvailable(false);
        }

        DonationRequest saved = donationRequestRepository.save(request);
        return DonationRequestDTO.fromEntity(saved);
    }

    public DonationRequestDTO rejectRequest(Long id, Long userId) {
        DonationRequest request = donationRequestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Donation request not found"));

        if (!request.getOwner().getId().equals(userId)) {
            throw new org.springframework.security.access.AccessDeniedException("Not authorized");
        }

        request.setStatus(DonationRequestStatus.REJECTED);

        DonationRequest saved = donationRequestRepository.save(request);
        return DonationRequestDTO.fromEntity(saved);
    }

    public DonationRequestDTO completeRequest(Long id, Long userId) {
        DonationRequest request = donationRequestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Donation request not found"));

        if (!request.getOwner().getId().equals(userId) && !request.getRequester().getId().equals(userId)) {
            throw new org.springframework.security.access.AccessDeniedException("Not authorized");
        }

        if (request.getStatus() != DonationRequestStatus.ACCEPTED) {
            throw new IllegalArgumentException("Only accepted requests can be completed");
        }

        request.setStatus(DonationRequestStatus.COMPLETED);

        DonationRequest saved = donationRequestRepository.save(request);
        return DonationRequestDTO.fromEntity(saved);
    }

    public void deleteRequest(Long id, Long userId) {
        DonationRequest request = donationRequestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Donation request not found"));

        if (!request.getRequester().getId().equals(userId)) {
            throw new org.springframework.security.access.AccessDeniedException("Not authorized");
        }

        if (request.getStatus() != DonationRequestStatus.PENDING) {
            throw new IllegalArgumentException("Only pending requests can be deleted");
        }

        donationRequestRepository.deleteById(id);
    }
}
