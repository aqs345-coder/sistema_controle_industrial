package com.industry.resource;

import java.util.List;

import com.industry.dto.ProductionSuggestionDTO;
import com.industry.model.Product;
import com.industry.model.ProductComposition;
import com.industry.service.ProductService;
import com.industry.dto.ProductionPlanResponse;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.MediaType;

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

    @PUT
    @Path("/{id}")
    @Transactional
    public Product update(@PathParam("id") Long id, Product product) {
        Product entity = Product.findById(id);
        if (entity == null) throw new WebApplicationException(404);
        entity.name = product.name;
        entity.value = product.value;
        return entity;
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public void delete(@PathParam("id") Long id) {
        Product entity = Product.findById(id);
        if (entity == null) throw new WebApplicationException(404);
        ProductComposition.delete("product.id = ?1", id);
        entity.delete();
    }

    @DELETE
    @Path("/{id}/composition/{materialId}")
    @Transactional
    public void removeIngredient(@PathParam("id") Long id, @PathParam("materialId") Long materialId) {
        ProductComposition.delete("product.id = ?1 and rawMaterial.id = ?2", id, materialId);
    }

    @POST
    @Path("/{id}/composition")
    public void addComposition(@PathParam("id") Long id, 
                               @QueryParam("materialId") Long materialId, 
                               @QueryParam("quantity") Integer quantity) {
        service.addComposition(id, materialId, quantity);        
    }

    @GET
    @Path("/suggestion")
    public ProductionPlanResponse getSuggestion() { // Mudou de List<DTO> para ProductionPlanResponse
        return service.calculateProduction();
    }
}