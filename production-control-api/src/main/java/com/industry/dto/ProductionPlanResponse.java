package com.industry.dto;

import java.util.List;

public class ProductionPlanResponse {
    public List<ProductionSuggestionDTO> suggestions;
    
    public List<MaterialUsageDTO> materialUsage;
    
    public Double totalRevenue;
}