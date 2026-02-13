package com.industry.resource;

import java.util.List;

import com.industry.model.RawMaterial;
import com.industry.service.RawMaterialService;

import jakarta.inject.Inject;
import jakarta.persistence.PersistenceException;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/raw-materials")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RawMaterialResource {
    
    @Inject
    RawMaterialService service;

    @GET
    public List<RawMaterial> getAll() {
        return service.listAll();
    }

    @POST
    public RawMaterial create(RawMaterial rawMaterial) {
        return service.create(rawMaterial);
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public RawMaterial update(@PathParam("id") Long id, RawMaterial material) {
        RawMaterial entity = RawMaterial.findById(id);
        if (entity == null) {
            throw new WebApplicationException("Material not found", 404);
        }
        entity.name = material.name;
        entity.stockQuantity = material.stockQuantity;
        return entity;
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public Response delete(@PathParam("id") Long id) {
        try {
            RawMaterial entity = RawMaterial.findById(id);
            if (entity == null) return Response.status(404).build();
            entity.delete();
            return Response.noContent().build();
        } catch (PersistenceException e) {
            return Response.status(409).entity("Material is being used in a recipe.").build();
        }
    }
}