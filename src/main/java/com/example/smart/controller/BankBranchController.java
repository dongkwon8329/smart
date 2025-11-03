package com.example.smart.controller;

import com.example.smart.entity.BankBranch;
import com.example.smart.service.BankBranchService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/branches")
@CrossOrigin(origins = "http://localhost:3000") // ✅ React 연결 허용
public class BankBranchController {

    private final BankBranchService service;

    public BankBranchController(BankBranchService service) {
        this.service = service;
    }

    @GetMapping
    public List<BankBranch> getAllBranches() {
        return service.getAllBranches();
    }
}

