package com.repassa.backend.donationrequest;

import com.repassa.backend.auth.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/donation-requests")
@CrossOrigin(origins = "*")
public class DonationRequestController {

    private final DonationRequestService donationRequestService;

    public DonationRequestController(DonationRequestService donationRequestService) {
        this.donationRequestService = donationRequestService;
    }

    private Long getCurrentUserId() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return user.getId();
    }

    @GetMapping
    public ResponseEntity<List<DonationRequestDTO>> getMyReceivedRequests() {
        return ResponseEntity.ok(donationRequestService.findMyReceivedRequests(getCurrentUserId()));
    }

    @GetMapping("/sent")
    public ResponseEntity<List<DonationRequestDTO>> getMySentRequests() {
        return ResponseEntity.ok(donationRequestService.findMySentRequests(getCurrentUserId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DonationRequestDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(donationRequestService.findById(id, getCurrentUserId()));
    }

    @PostMapping
    public ResponseEntity<DonationRequestDTO> createRequest(@RequestBody DonationRequestDTO dto) {
        return ResponseEntity.ok(donationRequestService.createRequest(dto, getCurrentUserId()));
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<DonationRequestDTO> acceptRequest(@PathVariable Long id) {
        return ResponseEntity.ok(donationRequestService.acceptRequest(id, getCurrentUserId()));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<DonationRequestDTO> rejectRequest(@PathVariable Long id) {
        return ResponseEntity.ok(donationRequestService.rejectRequest(id, getCurrentUserId()));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<DonationRequestDTO> completeRequest(@PathVariable Long id) {
        return ResponseEntity.ok(donationRequestService.completeRequest(id, getCurrentUserId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequest(@PathVariable Long id) {
        donationRequestService.deleteRequest(id, getCurrentUserId());
        return ResponseEntity.noContent().build();
    }
}
