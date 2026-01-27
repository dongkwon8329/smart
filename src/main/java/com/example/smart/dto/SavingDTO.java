package com.example.smart.dto;

import com.example.smart.entity.Saving;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SavingDTO {
    private Long id;
    private String bankName;
    private String productName;
    private double interestRate;
    private double maxInterestRate;
    private int period;
    private String condition;
    private String linkUrl;

    public static SavingDTO fromEntity(Saving s) {
        return SavingDTO.builder()
                .id(s.getId())
                .bankName(s.getBankName())
                .productName(s.getProductName())
                .interestRate(s.getInterestRate())
                .maxInterestRate(s.getMaxInterestRate())
                .period(s.getPeriod())
                .condition(s.getCondition())
                .linkUrl(s.getLinkUrl())
                .build();
    }
    public static Saving toEntity(SavingDTO dto) {
        return Saving.builder()
                .id(dto.getId())
                .bankName(dto.getBankName())
                .productName(dto.getProductName())
                .interestRate(dto.getInterestRate())
                .maxInterestRate(dto.getMaxInterestRate())
                .period(dto.getPeriod())
                .condition(dto.getCondition())
                .build();
    }
}

