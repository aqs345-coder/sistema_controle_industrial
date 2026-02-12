package com.industry.service;

import com.industry.model.Product;
import com.industry.model.ProductComposition;
import com.industry.model.RawMaterial;
import com.industry.dto.ProductionSuggestionDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.util.*;

@ApplicationScoped
public class ProductService {
    
    public List<Product> listAll() {
        return Product.listAll();
    }

    @Transactional
    public Product create(Product product) {
        product.persist();
        return product;
    }

    // Method to add composition (recipe for a product)
    @Transactional
    public void addComposition(Long productId, Long rawMaterialId, Integer quantity) {
        Product product = Product.findById(productId);
        RawMaterial material = RawMaterial.findById(rawMaterialId);

        if (product == null || material == null) {
            throw new RuntimeException("Product or Material not found");
        }

        ProductComposition composition = new ProductComposition();
        composition.product = product;
        composition.rawMaterial = material;
        composition.requiredQuantity = quantity;
        composition.persist();
    }

    // Greedy Algorithm
    public List<ProductionSuggestionDTO> calculateProduction() {
        List<Product> products = Product.listAll();
        List<ProductComposition> compositions = ProductComposition.listAll();
        List<RawMaterial> materials = RawMaterial.listAll();

        Map<Long, Integer> tempStock = new HashMap<>();
        for (RawMaterial rm : materials) {
            tempStock.put(rm.id, rm.stockQuantity);
        }

        products.sort((p1, p2) -> p2.value.compareTo(p1.value));

        List<ProductionSuggestionDTO> suggestions = new ArrayList<>();

        for (Product product : products) {
            List<ProductComposition> productRecipe = compositions.stream()
                    .filter(c -> c.product.id.equals(product.id))
                    .toList();

                if (productRecipe.isEmpty()) continue;

                int maxPossible = Integer.MAX_VALUE;

                for (ProductComposition item : productRecipe) {
                    int currentStock = tempStock.getOrDefault(item.rawMaterial.id, 0);
                    int canMake = currentStock / item.requiredQuantity;
                    maxPossible = Math.min(maxPossible, canMake);
                }

                if (maxPossible > 0) {
                    suggestions.add(new ProductionSuggestionDTO(
                        product.name,
                        maxPossible,
                        maxPossible * product.value
                    ));

                    for (ProductComposition item : productRecipe) {
                        int consumed = maxPossible * item.requiredQuantity;
                        Long matId = item.rawMaterial.id;
                        tempStock.put(matId, tempStock.get(matId) - consumed);
                    }
                }
        }
        
        return suggestions;
    }
}
