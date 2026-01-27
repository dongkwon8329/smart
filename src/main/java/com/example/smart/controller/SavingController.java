// SavingController.java
package com.example.smart.controller;

import com.example.smart.dto.SavingDTO;
import com.example.smart.service.SavingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/savings")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000") // ✅ 프론트 허용
public class SavingController {

    private final SavingService savingService;

    // ✅ [1] 필터 + 정렬 기능 (사용자용)
    @GetMapping
    public List<SavingDTO> getSavings(
            @RequestParam(required = false) String bankName,
            @RequestParam(required = false) Double minRate,
            @RequestParam(required = false) Integer maxPeriod,
            @RequestParam(required = false) String sortBy
    ) {
        return savingService.filterAndSort(bankName, minRate, maxPeriod, sortBy);
    }

    // ✅ [2] 단일 상품 상세 조회 (사용자용)
    @GetMapping("/{id}")
    public SavingDTO getSavingById(@PathVariable Long id) {
        return savingService.findById(id);
    }

    // ✅ [3] 상품 등록 (관리자용)
    @PostMapping
    public SavingDTO createSaving(@RequestBody SavingDTO savingDTO) {
        return savingService.saveSaving(savingDTO);
    }

    // ✅ [4] 상품 수정 (관리자용)
    @PutMapping("/{id}")
    public SavingDTO updateSaving(@PathVariable Long id, @RequestBody SavingDTO savingDTO) {
        return savingService.updateSaving(id, savingDTO);
    }

    // ✅ [5] 상품 삭제 (관리자용)
    @DeleteMapping("/{id}")
    public void deleteSaving(@PathVariable Long id) {
        savingService.deleteSaving(id);
    }
}
