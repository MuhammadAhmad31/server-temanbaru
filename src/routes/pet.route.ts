import { Hono } from "hono";
import { AppContext } from "../types/app.type";

const pets = new Hono<{
  Bindings: AppContext['env'];
  Variables: AppContext['var'];
}>();

pets.get('/', async (c: AppContext) => {
  const { pet } = c.var.controllers;
  return await pet.getPets(c);
});


export { pets };