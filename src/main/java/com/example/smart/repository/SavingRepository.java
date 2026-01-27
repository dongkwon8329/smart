package com.example.smart.repository;

import com.example.smart.entity.Saving;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SavingRepository extends JpaRepository<Saving, Long> {
    // JpaRepository가 기본 CRUD 제공

}

