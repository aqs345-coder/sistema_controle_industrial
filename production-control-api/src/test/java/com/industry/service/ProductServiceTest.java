package com.industry.service;

import java.util.List;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import com.industry.dto.ProductionSuggestionDTO;
import com.industry.model.Product;
import com.industry.model.ProductComposition;
import com.industry.model.RawMaterial;

import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
@QuarkusTest
public class ProductServiceTest {
    
    @Inject
    ProductService productService;

    @Test
    @Transactional
    public void testGreedyAlgorithm() {
        ProductComposition.deleteAll();
        Product.deleteAll();
        RawMaterial.deleteAll();

        RawMaterial wood = new RawMaterial();
        wood.name = "Wood";
        wood.stockQuantity = 1000;
        wood.persist();

        Product table = new Product();
        table.name = "Table";
        table.value = 100.0;
        table.persist();
        productService.addComposition(table.id, wood.id, 10);

        Product chair = new Product();
        chair.name = "Chair";
        chair.value = 50.0;
        chair.persist();
        productService.addComposition(chair.id, wood.id, 2);

        List<ProductionSuggestionDTO> suggestion = productService.calculateProduction();

        Assertions.assertFalse(suggestion.isEmpty());
        
        ProductionSuggestionDTO firstSuggestion = suggestion.get(0);
        Assertions.assertEquals("Table", firstSuggestion.productName);
        Assertions.assertEquals(10, firstSuggestion.quantity);

        boolean hasChair = suggestion.stream().anyMatch(s -> s.productName.equals("Chair"));
        Assertions.assertFalse(hasChair, "Não deveria sugerir cadeiras pois a madeira acabou nas mesas");
    }
}
