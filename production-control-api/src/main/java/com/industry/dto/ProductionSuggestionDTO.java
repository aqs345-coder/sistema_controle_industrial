package com.industry.dto;

public class ProductionSuggestionDTO {
    public String productName;
    public int quantity;
    public double totalValue;

    public ProductionSuggestionDTO(String productName, int quantity, double totalValue) {
        this.productName = productName;
        this.quantity = quantity;
        this.totalValue = totalValue;
    }
}
