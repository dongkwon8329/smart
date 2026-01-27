package com.example.smart.service;

import com.example.smart.dto.SavingDTO;
import com.example.smart.entity.Saving;
import com.example.smart.repository.SavingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SavingService {

    private final SavingRepository savingRepository;

    // ✅ 기존: 필터 + 정렬 기능
    public List<SavingDTO> filterAndSort(String bankName, Double minRate, Integer maxPeriod, String sortBy) {
        List<Saving> savings = savingRepository.findAll();

        // 1️⃣ 필터링
        if (bankName != null && !bankName.isEmpty()) {
            savings = savings.stream()
                    .filter(s -> s.getBankName().contains(bankName))
                    .collect(Collectors.toList());
        }
        if (minRate != null) {
            savings = savings.stream()
                    .filter(s -> s.getInterestRate() >= minRate)
                    .collect(Collectors.toList());
        }
        if (maxPeriod != null) {
            savings = savings.stream()
                    .filter(s -> s.getPeriod() <= maxPeriod)
                    .collect(Collectors.toList());
        }

        // 2️⃣ 정렬
        if (sortBy != null) {
            switch (sortBy) {
                case "rateAsc":
                    savings.sort(Comparator.comparing(Saving::getInterestRate));
                    break;
                case "rateDesc":
                    savings.sort(Comparator.comparing(Saving::getInterestRate).reversed());
                    break;
                case "periodAsc":
                    savings.sort(Comparator.comparing(Saving::getPeriod));
                    break;
                case "periodDesc":
                    savings.sort(Comparator.comparing(Saving::getPeriod).reversed());
                    break;
            }
        }

        // DTO 변환 후 반환
        return savings.stream()
                .map(SavingDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // ✅ 기존: 단일 상품 상세 조회
    public SavingDTO findById(Long id) {
        Saving saving = savingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 상품을 찾을 수 없습니다."));
        return SavingDTO.fromEntity(saving);
    }

    // ✅ 추가: 상품 등록 (CREATE)
    public SavingDTO saveSaving(SavingDTO dto) {
        Saving saving = SavingDTO.toEntity(dto);
        Saving saved = savingRepository.save(saving);
        return SavingDTO.fromEntity(saved);
    }

    // ✅ 추가: 상품 수정 (UPDATE)
    public SavingDTO updateSaving(Long id, SavingDTO dto) {
        Saving existing = savingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 상품입니다."));

        existing.setBankName(dto.getBankName());
        existing.setProductName(dto.getProductName());
        existing.setInterestRate(dto.getInterestRate());
        existing.setMaxInterestRate(dto.getMaxInterestRate());
        existing.setPeriod(dto.getPeriod());
        existing.setCondition(dto.getCondition());

        Saving updated = savingRepository.save(existing);
        return SavingDTO.fromEntity(updated);
    }

    // ✅ 추가: 상품 삭제 (DELETE)
    public void deleteSaving(Long id) {
        if (!savingRepository.existsById(id)) {
            throw new RuntimeException("삭제할 상품을 찾을 수 없습니다.");
        }
        savingRepository.deleteById(id);
    }
}
