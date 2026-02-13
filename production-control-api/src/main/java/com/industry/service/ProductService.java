package com.industry.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.industry.dto.MaterialUsageDTO;
import com.industry.dto.ProductionPlanResponse;
import com.industry.dto.ProductionSuggestionDTO;
import com.industry.model.Product;
import com.industry.model.ProductComposition;
import com.industry.model.RawMaterial;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.WebApplicationException;

@ApplicationScoped
public class ProductService {

    @Transactional
    public Product create(Product product) {
        product.persist();
        return product;
    }

    public List<Product> listAll() {
        return Product.listAll();
    }

    @Transactional
    public void addComposition(Long productId, Long materialId, Integer quantity) {
        long count = ProductComposition.count("product.id = ?1 and rawMaterial.id = ?2", productId, materialId);
        if (count > 0) {
            throw new WebApplicationException("This ingredient is already linked to the product.", 409);
        }

        Product product = Product.findById(productId);
        RawMaterial material = RawMaterial.findById(materialId);

        if (product != null && material != null) {
            ProductComposition composition = new ProductComposition();
            composition.product = product;
            composition.rawMaterial = material;
            composition.quantity = quantity;
            composition.persist();
        } else {
             throw new WebApplicationException("Product or Material not found.", 404);
        }
    }

    public ProductionPlanResponse calculateProduction() {
        List<Product> products = Product.listAll();
        List<RawMaterial> materials = RawMaterial.listAll();

        Map<Long, Integer> tempStock = new HashMap<>();
        Map<Long, String> materialNames = new HashMap<>();
        Map<Long, Integer> initialStock = new HashMap<>();

        for (RawMaterial rm : materials) {
            tempStock.put(rm.id, rm.stockQuantity);
            initialStock.put(rm.id, rm.stockQuantity);
            materialNames.put(rm.id, rm.name);
        }

        products.sort(Comparator.comparing((Product p) -> p.value).reversed());

        List<ProductionSuggestionDTO> suggestions = new ArrayList<>();
        double totalRevenue = 0.0;

        for (Product product : products) {
            if (product.composition == null || product.composition.isEmpty()) continue;

            int maxPossible = Integer.MAX_VALUE;

            for (ProductComposition comp : product.composition) {
                int available = tempStock.getOrDefault(comp.rawMaterial.id, 0);
                int canMake = available / comp.quantity;
                maxPossible = Math.min(maxPossible, canMake);
            }

            if (maxPossible > 0) {
                ProductionSuggestionDTO dto = new ProductionSuggestionDTO();
                dto.productName = product.name;
                dto.quantity = maxPossible;
                dto.totalValue = maxPossible * product.value;
                suggestions.add(dto);

                totalRevenue += dto.totalValue;

                for (ProductComposition comp : product.composition) {
                    Long matId = comp.rawMaterial.id;
                    int current = tempStock.get(matId);
                    tempStock.put(matId, current - (comp.quantity * maxPossible));
                }
            }
        }

        List<MaterialUsageDTO> usageReport = new ArrayList<>();
        for (Long matId : initialStock.keySet()) {
            int start = initialStock.get(matId);
            int end = tempStock.get(matId);
            int used = start - end;
            
            if (used > 0) {
                usageReport.add(new MaterialUsageDTO(materialNames.get(matId), used, end));
            }
        }

        ProductionPlanResponse response = new ProductionPlanResponse();
        response.suggestions = suggestions;
        response.materialUsage = usageReport;
        response.totalRevenue = totalRevenue;

        return response;
    }
}