package com.industry.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class ProductComposition extends PanacheEntity {

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    public Product product;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "raw_material_id")
    public RawMaterial rawMaterial;

    public Integer quantity;
}