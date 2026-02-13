package com.industry.dto;

public class MaterialUsageDTO {
    public String materialName;
    public Integer quantityUsed;
    public Integer remainingStock;

    public MaterialUsageDTO(String name, Integer used, Integer remaining) {
        this.materialName = name;
        this.quantityUsed = used;
        this.remainingStock = remaining;
    }
}