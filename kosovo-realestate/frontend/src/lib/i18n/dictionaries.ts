import { navbar } from './dict/navbar';
import { home } from './dict/home';
import { footer } from './dict/footer';
import { hero } from './dict/hero';
import { heroSearch } from './dict/heroSearch';
import { listingSection } from './dict/listingSection';
import { popularCities } from './dict/popularCities';
import { misc } from './dict/misc';
import { propertyTypes } from './dict/propertyTypes';
import { properties } from './dict/properties';
import { propertyDetail } from './dict/propertyDetail';
import { agentsPage } from './dict/agentsPage';
import { auth } from './dict/auth';
import { listProperty } from './dict/listProperty';
import { admin } from './dict/admin';
import { whatsapp } from './dict/whatsapp';
import { staticPages } from './dict/staticPages';

export const dictionaries = {
  navbar,
  home,
  footer,
  hero,
  heroSearch,
  listingSection,
  popularCities,
  misc,
  propertyTypes,
  properties,
  propertyDetail,
  agentsPage,
  auth,
  listProperty,
  admin,
  whatsapp,
  staticPages,
};

export type Namespace = keyof typeof dictionaries;
