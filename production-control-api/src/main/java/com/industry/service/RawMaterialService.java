package com.industry.service;

import com.industry.model.RawMaterial;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.util.List;

@ApplicationScoped
public class RawMaterialService {
    
    public List<RawMaterial> listAll() {
        return RawMaterial.listAll();
    }

    @Transactional
    public RawMaterial create(RawMaterial rawMaterial) {
        rawMaterial.persist();
        return rawMaterial;
    }

    @Transactional
    public RawMaterial update(Long id, RawMaterial rawMaterial) {
        RawMaterial entity = RawMaterial.findById(id);
        if (entity == null) {
            throw new RuntimeException("Raw Material not found");
        }
        entity.name = rawMaterial.name;
        entity.stockQuantity = rawMaterial.stockQuantity;
        return entity;
    }

    @Transactional
    public void delete(Long id) {
        RawMaterial.deleteById(id);
    }
}
