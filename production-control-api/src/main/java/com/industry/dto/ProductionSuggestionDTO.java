package com.industry.dto;

public class ProductionSuggestionDTO {
    public String productName;
    public Integer quantity;
    public Double totalValue;

    public ProductionSuggestionDTO() {}

    public ProductionSuggestionDTO(String productName, Integer quantity, Double totalValue) {
        this.productName = productName;
        this.quantity = quantity;
        this.totalValue = totalValue;
    }
}