package com.industry.model;

import java.util.List;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;

@Entity
public class Product extends PanacheEntity {

    public String name;
    public Double value;

    @OneToMany(mappedBy = "product", fetch = FetchType.EAGER)
    public List<ProductComposition> composition;
}