import type { ImageMetadata } from 'astro';

import audi          from '../assets/images/clientes/audi.png';
import volkswagen    from '../assets/images/clientes/volkswagen.png';
import honda         from '../assets/images/clientes/honda.png';
import faurecia      from '../assets/images/clientes/faurecia.png';
import nestle        from '../assets/images/clientes/nestle.png';
import liconsa       from '../assets/images/clientes/liconsa.png';
import aje           from '../assets/images/clientes/aje.png';
import jugosDelValle from '../assets/images/clientes/jugos-del-valle.png';
import sabroLeche    from '../assets/images/clientes/sabro-leche.png';
import maulec        from '../assets/images/clientes/maulec.png';
import astrazeneca   from '../assets/images/clientes/astrazeneca.png';
import bayer         from '../assets/images/clientes/bayer.png';
import fisherSci     from '../assets/images/clientes/fisher-scientific.png';
import innn          from '../assets/images/clientes/innn.png';
import pemex         from '../assets/images/clientes/pemex.png';
import cfe           from '../assets/images/clientes/cfe.png';
import ergon         from '../assets/images/clientes/ergon.png';
import sedena        from '../assets/images/clientes/sedena.png';
import colpos        from '../assets/images/clientes/colpos.png';
import gesber        from '../assets/images/clientes/gesber.png';

export interface Cliente {
  src: ImageMetadata;
  alt: string;
  industry: string;
}

export const clientes: Cliente[] = [
  { src: audi,          alt: 'Audi',                      industry: 'Automotriz'          },
  { src: volkswagen,    alt: 'Volkswagen',                 industry: 'Automotriz'          },
  { src: honda,         alt: 'Honda',                      industry: 'Automotriz'          },
  { src: faurecia,      alt: 'Faurecia',                   industry: 'Automotriz'          },
  { src: nestle,        alt: 'Nestlé',                     industry: 'Alimentaria'         },
  { src: liconsa,       alt: 'Liconsa',                    industry: 'Alimentaria'         },
  { src: aje,           alt: 'AJE',                        industry: 'Alimentaria'         },
  { src: jugosDelValle, alt: 'Jugos del Valle',            industry: 'Alimentaria'         },
  { src: sabroLeche,    alt: 'Sabro Leche',                industry: 'Alimentaria'         },
  { src: maulec,        alt: 'Pasteurizadora Maulec',      industry: 'Alimentaria'         },
  { src: astrazeneca,   alt: 'AstraZeneca',                industry: 'Farmacéutica y Médica' },
  { src: bayer,         alt: 'Bayer',                      industry: 'Farmacéutica y Médica' },
  { src: fisherSci,     alt: 'Fisher Scientific',          industry: 'Farmacéutica y Médica' },
  { src: innn,          alt: 'Inst. Nac. de Neurología',   industry: 'Farmacéutica y Médica' },
  { src: pemex,         alt: 'PEMEX',                      industry: 'Energía'             },
  { src: cfe,           alt: 'CFE',                        industry: 'Energía'             },
  { src: ergon,         alt: 'ERGON',                      industry: 'Energía'             },
  { src: sedena,        alt: 'SEDENA',                     industry: 'Gobierno y Defensa'  },
  { src: colpos,        alt: 'Colegio de Posgraduados',    industry: 'Gobierno y Defensa'  },
  { src: gesber,        alt: 'Grupo Gesber',               industry: 'Gobierno y Defensa'  },
];
