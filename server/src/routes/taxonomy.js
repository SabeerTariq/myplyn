import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { getCountries, getStates, getCities } from '../data/locations.js';

const router = Router();

router.get('/niches', async (req, res) => {
  const niches = await prisma.niche.findMany({ where: { active: true }, orderBy: { name: 'asc' } });
  res.json({ niches });
});

router.get('/platforms', async (req, res) => {
  const platforms = await prisma.platform.findMany({ where: { active: true }, orderBy: { name: 'asc' } });
  res.json({ platforms });
});

router.get('/countries', async (req, res) => {
  res.json({ countries: getCountries() });
});

router.get('/states', async (req, res) => {
  const { country } = req.query;
  res.json({ states: getStates(country) });
});

router.get('/cities', async (req, res) => {
  const { country, state } = req.query;
  res.json({ cities: getCities(country, state) });
});

export default router;
