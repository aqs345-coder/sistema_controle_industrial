package com.industry.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Column;

@Entity
public class RawMaterial extends PanacheEntity {
    
    @Column(nullable = false)
    public String name;

    @Column(nullable = false)
    public Integer stockQuantity;

}
