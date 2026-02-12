package com.industry.resource;

import com.industry.model.RawMaterial;
import com.industry.service.RawMaterialService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import java.util.List;

@Path("/rawMaterials")
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
    public RawMaterial update(@PathParam("id") Long id, RawMaterial rawMaterial) {
        return service.update(id, rawMaterial);
    }

    @DELETE
    @Path("/{id}")
    public void delete(@PathParam("id") Long id) {
        service.delete(id);
    }
}
