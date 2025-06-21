import { Hono } from "hono";
import { AppContext } from "../types/app.type";
import { authMiddlewareUser } from "../middleware/auth";

const adoption = new Hono<{
  Bindings: AppContext['env'];
  Variables: AppContext['var'];
}>();

adoption.use('*', authMiddlewareUser); 

adoption.post('/:id/adopt', async (c: AppContext) => {
  const { adoption } = c.var.controllers;
    return await adoption.postAdoptionRequest(c);
});

adoption.get('/', async (c: AppContext) => {
  const { adoption } = c.var.controllers;
  return await adoption.getAdoption(c);
});

export { adoption };
