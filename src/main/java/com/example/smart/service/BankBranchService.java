package com.example.smart.service;

import com.example.smart.entity.BankBranch;
import com.example.smart.repository.BankBranchRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BankBranchService {

    private final BankBranchRepository repository;

    public BankBranchService(BankBranchRepository repository) {
        this.repository = repository;
    }

    public List<BankBranch> getAllBranches() {
        return repository.findAll();
    }
}
