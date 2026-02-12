package com.industry.resource;

import com.industry.model.Product;
import com.industry.dto.ProductionSuggestionDTO;
import com.industry.service.ProductService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import java.util.List;

@Path("/products")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductResource {
    
    @Inject
    ProductService service;

    @GET
    public List<Product> getAll() {
        return service.listAll();
    }

    @POST
    public Product create(Product product) {
        return service.create(product);
    }

    @POST
    @path("/{id}/composition")
    public void addComposition(@PathParam("id") Long id, 
                               @QueryParam("materialId") Long materialId, 
                               @QueryParam("quantity") Integer quantity) {
        service.addComposition(id, materialId, quantity);        
    }

    @GET
    @Path("/suggestion")
    public List<ProductionSuggestionDTO> getSuggestion() {
        return service.calculateProduction();
    }
}
