import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import {
  Mail,
  ChevronLeft,
  ChevronRight,
  X,
  Sun,
  Moon,
  Play,
  Copy,
  Check,
  Download,
  ArrowUpRight,
} from 'lucide-react';

type Theme = 'dark' | 'light';

const THEME_STORAGE_KEY = 'lh-theme';
const BASE_COLOR: Record<Theme, string> = { dark: '#0f0f0f', light: '#f4f2ee' };

/** Prefija una ruta de `public/` con la base de Vite (en GitHub Pages el sitio vive en un subpath). */
const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

const CONTACT_EMAIL = 'lucashess98@gmail.com';
const YOUTUBE_URL = 'https://youtube.com/@tierso-rayo';
const INSTAGRAM_URL = 'https://www.instagram.com/tiers0';

const SHORT_BIO =
  'Lucas Hess es un vocalista interdisciplinario radicado en Buenos Aires, formado en la Escuela de Música Contemporánea (EMC) y con base técnica en producción musical. Su trabajo integra interpretación, escena e identidad visual. Bajo el alter ego Tierso lanzó en diciembre de 2025 su primer EP, Deser0: música experimental con arreglos corales, percusiones sintéticas y espacialidad.';

const EP_TRACKS = [
  { id: 'xeVIhXe_nbc', title: 'Deser0 — EP completo', kind: 'Full visualizer' },
  { id: 'Cl_QYsf-bLE', title: 'Vías', kind: 'Visualizer' },
  { id: '4ytpcMIQ9lM', title: 'Voy', kind: 'Visualizer' },
  { id: 'J6UNOYmk5U8', title: 'Rayo', kind: 'Visualizer' },
];


type IconProps = React.SVGProps<SVGSVGElement> & { strokeWidth?: number };

function Instagram({ strokeWidth = 1.25, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function Youtube({ strokeWidth = 1.25, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

const GALLERY_CATEGORIES = [
  {
    id: 'sin-capas',
    title: 'Sin capas',
    subtitle: 'El punto de partida',
    description: 'Retratos sin maquillaje, vestuario ni intervención. Un registro fiel del presente que funciona como base de trabajo: el material desde el cual se proyecta cada propuesta.',
    color: { dark: '#151515', light: '#efede9' },
    images: [
      '/gallery/esencia/01.jpg',
      '/gallery/esencia/02.jpg',
      '/gallery/esencia/03.jpg',
      '/gallery/esencia/04.jpg',
      '/gallery/esencia/05.jpg',
      '/gallery/esencia/06.jpg',
      '/gallery/esencia/07.jpg',
      '/gallery/esencia/08.jpg',
      '/gallery/esencia/09.jpg',
      '/gallery/esencia/10.jpg',
      '/gallery/esencia/11.jpg',
    ]
  },
  {
    id: 'tierso',
    title: 'Tierso',
    subtitle: 'Alter ego artístico',
    description: 'Alter ego experimental surgido durante la composición de Deser0, primer EP lanzado en diciembre de 2025. Música experimental construida a partir de arreglos corales, percusiones sintéticas y un trabajo deliberado sobre la espacialidad del sonido.',
    color: { dark: '#0a1210', light: '#e9f0ec' },
    images: [
      '/gallery/yoruba/01.jpg',
      '/gallery/yoruba/02.jpg',
      '/gallery/yoruba/03.jpg',
      '/gallery/yoruba/04.jpg',
      '/gallery/yoruba/05.jpg',
    ]
  },
  {
    id: 'glamour',
    title: 'Algo de glamour',
    subtitle: 'Estéticas bohemias',
    description: 'Búsqueda de una estética bohemia construida desde el detalle. El proceso implicó un scouting de vestuario y de locaciones capaces de realzar cada prenda, acompañado de un maquillaje sobrio que deja el protagonismo a la textura y la luz.',
    color: { dark: '#1a0d16', light: '#f2e9ee' },
    images: [
      '/gallery/jazz/01.jpg',
      '/gallery/jazz/02.jpg',
      '/gallery/jazz/03.jpg',
      '/gallery/jazz/04.jpg',
      '/gallery/jazz/05.jpg',
      '/gallery/jazz/06.jpg',
    ]
  },
  {
    id: 'material',
    title: 'Material',
    subtitle: 'Colaboración académica · FADU',
    description: 'Resultado de una colaboración con estudiantes de FADU, que lo convocaron para un trabajo académico cuyo eje fue Latinoamérica atravesada por el capitalismo contemporáneo. La imagen se construye desde lo áspero, lo precario y lo material.',
    color: { dark: '#1f140e', light: '#f3ebe3' },
    images: [
      '/gallery/folklore/01.gif',
      '/gallery/folklore/02.jpg',
      '/gallery/folklore/03.jpg',
      '/gallery/folklore/04.gif',
      '/gallery/folklore/05.gif',
    ]
  },
];

function LiteYouTube({ id, title, initialActive = false }: { id: string; title: string; initialActive?: boolean }) {
  const [active, setActive] = useState(initialActive);

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-black">
      {active ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          aria-label={`Reproducir ${title}`}
          className="group/video absolute inset-0 h-full w-full text-left"
        >
          <img
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover opacity-80 transition-opacity duration-500 group-hover/video:opacity-100"
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/60 bg-black/30 text-white backdrop-blur-sm transition-colors duration-300 group-hover/video:bg-white group-hover/video:text-black">
              <Play className="ml-0.5 h-5 w-5" strokeWidth={1.25} fill="currentColor" />
            </span>
          </span>
        </button>
      )}
    </div>
  );
}

function CategoryFrames({ images, title }: { images: string[]; title: string }) {
  const scroller = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, scroll: 0, moved: false });
  const swipe = useRef<number | null>(null);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(null);

  const syncActive = () => {
    const el = scroller.current;
    if (!el) return;
    const slides = [...el.querySelectorAll<HTMLElement>('[data-slide]')];
    if (!slides.length) return;
    const edge = el.getBoundingClientRect().left;
    let closest = 0;
    let min = Infinity;
    slides.forEach((slide, i) => {
      const distance = Math.abs(slide.getBoundingClientRect().left - edge);
      if (distance < min) {
        min = distance;
        closest = i;
      }
    });
    setActive(closest);
  };

  const scrollToIndex = (index: number) => {
    const el = scroller.current;
    if (!el) return;
    const slide = el.querySelectorAll<HTMLElement>('[data-slide]')[index];
    if (!slide) return;
    const left = slide.getBoundingClientRect().left - el.getBoundingClientRect().left + el.scrollLeft;
    el.scrollTo({ left, behavior: 'smooth' });
  };

  useEffect(() => {
    if (open === null) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(null);
      if (event.key === 'ArrowRight') setOpen((current) => (current === null ? current : (current + 1) % images.length));
      if (event.key === 'ArrowLeft') setOpen((current) => (current === null ? current : (current - 1 + images.length) % images.length));
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, images.length]);

  return (
    <div className="group/strip min-w-0 w-full lg:flex-1">
      <div className="mb-3 pr-5 text-[10px] uppercase tracking-[0.22em] text-fg/40 tabular-nums">
        {String(active + 1).padStart(2, '0')}
        <span className="mx-1.5 text-fg/20">/</span>
        {String(images.length).padStart(2, '0')}
      </div>

      <div className="relative min-w-0">
        <div
          ref={scroller}
          onScroll={syncActive}
          onPointerDown={(event) => {
            if (event.pointerType === 'touch' || !scroller.current) return;
            drag.current = {
              active: true,
              startX: event.clientX,
              scroll: scroller.current.scrollLeft,
              moved: false,
            };
            scroller.current.style.scrollSnapType = 'none';
            scroller.current.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            if (!drag.current.active || !scroller.current) return;
            const delta = event.clientX - drag.current.startX;
            if (Math.abs(delta) > 6) drag.current.moved = true;
            scroller.current.scrollLeft = drag.current.scroll - delta;
          }}
          onPointerUp={() => {
            drag.current.active = false;
            if (scroller.current) scroller.current.style.scrollSnapType = '';
            if (drag.current.moved) {
              window.setTimeout(() => {
                drag.current.moved = false;
              }, 0);
            }
          }}
          onPointerCancel={() => {
            drag.current.active = false;
            drag.current.moved = false;
            if (scroller.current) scroller.current.style.scrollSnapType = '';
          }}
          className="gallery-scroll flex gap-3 md:gap-4 overflow-x-auto snap-x snap-mandatory pr-5 cursor-grab active:cursor-grabbing"
        >
          {images.map((imgUrl, imgIndex) => (
            <button
              key={imgUrl}
              type="button"
              data-slide
              onClick={() => {
                if (drag.current.moved) return;
                setOpen(imgIndex);
              }}
              className="relative shrink-0 snap-start overflow-hidden w-[78%] md:w-[42%] aspect-[3/4] text-left"
            >
              <img
                src={asset(imgUrl)}
                alt={`${title} ${imgIndex + 1}`}
                draggable={false}
                className="w-full h-full object-cover object-center select-none"
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          aria-label="Foto anterior"
          disabled={active === 0}
          onClick={() => scrollToIndex(Math.max(0, active - 1))}
          className="hidden md:flex absolute left-1 top-1/2 z-10 -translate-y-1/2 p-1.5 text-fg/40 opacity-0 transition-opacity duration-300 hover:text-fg group-hover/strip:opacity-100 disabled:pointer-events-none disabled:opacity-0"
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={1} />
        </button>
        <button
          type="button"
          aria-label="Foto siguiente"
          disabled={active >= images.length - 1}
          onClick={() => scrollToIndex(Math.min(images.length - 1, active + 1))}
          className="hidden md:flex absolute right-5 top-1/2 z-10 -translate-y-1/2 p-1.5 text-fg/40 opacity-0 transition-opacity duration-300 hover:text-fg group-hover/strip:opacity-100 disabled:pointer-events-none disabled:opacity-0"
        >
          <ChevronRight className="w-4 h-4" strokeWidth={1} />
        </button>
      </div>

      <div className="mt-4 mr-5 h-px bg-fg/10">
        <div
          className="h-px bg-fg/60 transition-[width] duration-300"
          style={{ width: `${((active + 1) / images.length) * 100}%` }}
        />
      </div>

      {open !== null && createPortal(
        <div
          className="fixed inset-0 z-[80] bg-black text-white flex items-center justify-center"
          onClick={() => setOpen(null)}
          onTouchStart={(event) => {
            swipe.current = event.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            if (swipe.current === null) return;
            const delta = (event.changedTouches[0]?.clientX ?? swipe.current) - swipe.current;
            swipe.current = null;
            if (Math.abs(delta) < 40) return;
            setOpen((current) =>
              current === null
                ? current
                : delta < 0
                  ? (current + 1) % images.length
                  : (current - 1 + images.length) % images.length
            );
          }}
        >
          <button
            type="button"
            aria-label="Cerrar"
            className="absolute top-5 right-5 p-2 text-white/50 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" strokeWidth={1} />
          </button>
          <button
            type="button"
            aria-label="Foto anterior"
            onClick={(event) => {
              event.stopPropagation();
              setOpen((open - 1 + images.length) % images.length);
            }}
            className="hidden md:block absolute left-8 p-2 text-white/50 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={1} />
          </button>
          <img
            src={asset(images[open])}
            alt={`${title} ${open + 1}`}
            onClick={(event) => event.stopPropagation()}
            className="max-h-[78vh] md:max-h-[82vh] max-w-[90vw] md:max-w-[86vw] object-contain select-none"
            draggable={false}
          />
          <button
            type="button"
            aria-label="Foto siguiente"
            onClick={(event) => {
              event.stopPropagation();
              setOpen((open + 1) % images.length);
            }}
            className="hidden md:block absolute right-8 p-2 text-white/50 hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" strokeWidth={1} />
          </button>
          <div
            className="absolute bottom-4 md:bottom-5 left-0 right-0 flex items-center justify-center gap-8 text-[10px] uppercase tracking-[0.22em] text-white/40 tabular-nums"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Foto anterior"
              onClick={() => setOpen((open - 1 + images.length) % images.length)}
              className="md:hidden p-2 text-white/50 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={1} />
            </button>
            <span>
              {String(open + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
            </span>
            <button
              type="button"
              aria-label="Foto siguiente"
              onClick={() => setOpen((open + 1) % images.length)}
              className="md:hidden p-2 text-white/50 hover:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" strokeWidth={1} />
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [activeSection, setActiveSection] = useState<string>('hero');

  const [track, setTrack] = useState(EP_TRACKS[0]);
  const [trackChosen, setTrackChosen] = useState(false);
  const [bioCopied, setBioCopied] = useState(false);

  const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'));

  const copyBio = async () => {
    try {
      await navigator.clipboard.writeText(SHORT_BIO);
      setBioCopied(true);
      window.setTimeout(() => setBioCopied(false), 2200);
    } catch {
      window.prompt('Copiá la bio:', SHORT_BIO);
    }
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const category = GALLERY_CATEGORIES.find((cat) => cat.id === activeSection);
    document.body.style.backgroundColor = category ? category.color[theme] : BASE_COLOR[theme];
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [activeSection, theme]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    GALLERY_CATEGORIES.forEach((cat) => {
      const element = document.getElementById(`category-${cat.id}`);
      if (element) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
                setActiveSection(cat.id);
              }
            });
          },
          { threshold: 0.3 }
        );
        observer.observe(element);
        observers.push(observer);
      }
    });

    const heroElement = document.getElementById('hero-section');
    if (heroElement) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection('hero');
            }
          });
        },
        { threshold: 0.3 }
      );
      observer.observe(heroElement);
      observers.push(observer);
    }

    return () => {
      observers.forEach(obs => obs.disconnect());
    };
  }, []);

  return (
    <div className="min-h-screen font-sans text-fg selection:bg-fg/20">

      <nav className="fixed top-0 left-0 right-0 z-50 px-5 pt-4 pb-3 md:px-12 md:py-6 lg:px-20 mix-blend-difference text-white">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-serif italic text-lg md:text-xl tracking-wide">Lucas Hess</span>
          <div className="flex flex-wrap gap-x-4 gap-y-1 md:gap-8 text-[10px] md:text-sm font-light uppercase tracking-[0.16em] md:tracking-[0.2em]">
            <a href="#perfil" className="hover:text-white/60 transition-colors">Perfil</a>
            <a href="#escuchar" className="hover:text-white/60 transition-colors">Escuchar</a>
            <a href="#galeria" className="hover:text-white/60 transition-colors">Portafolio</a>
            <a href="#conectar" className="hover:text-white/60 transition-colors">Conectar</a>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
              className="-my-1 inline-flex items-center justify-center p-1 hover:text-white/60 transition-colors"
            >
              {theme === 'dark'
                ? <Sun className="w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={1.25} />
                : <Moon className="w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={1.25} />}
            </button>
          </div>
        </div>
      </nav>

      <section
        id="hero-section"
        className="relative isolate min-h-screen overflow-hidden flex flex-col justify-end pb-16 md:pb-24 px-5 md:px-12 lg:px-20 text-white"
      >
        <video
          aria-hidden="true"
          autoPlay
          muted
          playsInline
          preload="metadata"
          onTimeUpdate={(event) => {
            if (event.currentTarget.currentTime >= 13) {
              event.currentTarget.currentTime = 0;
              void event.currentTarget.play();
            }
          }}
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
        >
          <source src={asset('/video/hero-tierso.mp4')} type="video/mp4" />
        </video>
        <div className="absolute inset-0 -z-10 bg-black/60" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/30 to-black/55" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="max-w-5xl min-w-0"
        >
          <div className="flex items-center gap-4 mb-6 text-white/60">
            <div className="w-10 h-px bg-white/70"></div>
            <span className="uppercase tracking-[0.22em] text-[11px] md:text-sm">Buenos Aires</span>
          </div>
          <h1 className="font-serif text-[clamp(3.1rem,11vw,8.75rem)] leading-[0.88] tracking-tight">
            Lucas Hess
          </h1>
          <p className="mt-4 md:mt-6 max-w-full font-serif italic text-white/60 text-[clamp(1.35rem,4.6vw,2.65rem)] leading-tight text-balance">
            Vocalista interdisciplinario
          </p>
        </motion.div>
      </section>

      <section id="perfil" className="py-16 md:py-24 px-5 md:px-12 lg:px-20 border-t border-fg/10">
        <div>
          <div className="grid gap-8 md:grid-cols-[0.8fr_1.4fr] md:gap-16 lg:gap-24">
            <div>
              <span className="text-[10px] uppercase tracking-[0.22em] text-fg/40">
                01 / Perfil
              </span>
              <h2 className="mt-4 font-serif text-4xl md:text-6xl leading-none">
                Perfil técnico
              </h2>
            </div>

            <p className="max-w-3xl text-base md:text-xl font-light text-fg/70 leading-relaxed">
              Vocalista interdisciplinario con formación profesional en canto y base técnica en
              producción musical. Su práctica integra interpretación, trabajo escénico y el
              desarrollo de una identidad visual propia.
            </p>
          </div>

          <div className="mt-12 md:mt-16 grid sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-fg/10">
            {[
              {
                label: 'Formación vocal',
                value: 'Escuela de Música Contemporánea (EMC).',
              },
              {
                label: 'Producción musical',
                value: 'Bachiller técnico con orientación en producción musical.',
              },
              {
                label: 'Experiencia escénica',
                value: 'Teatro musical y circuitos de artistas independientes.',
              },
              {
                label: 'Enfoque',
                value: 'Voz, escena, imagen y experimentación estética.',
              },
            ].map((item) => (
              <div
                key={item.label}
                className="min-h-36 border-r border-b border-fg/10 p-5 md:p-7"
              >
                <span className="text-[10px] uppercase tracking-[0.2em] text-fg/40">
                  {item.label}
                </span>
                <p className="mt-5 max-w-sm font-light leading-relaxed text-fg/75">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 md:mt-16 grid gap-8 md:grid-cols-[0.8fr_1.4fr] md:gap-16 lg:gap-24">
            <div>
              <span className="text-[10px] uppercase tracking-[0.22em] text-fg/40">Prensa</span>
              <p className="mt-4 max-w-xs font-serif text-xl md:text-2xl leading-snug">
                Material para programadores, prensa y colaboradores.
              </p>
            </div>
            <div>
              <p className="max-w-3xl font-light leading-relaxed text-fg/70">{SHORT_BIO}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={copyBio}
                  className="inline-flex items-center gap-2 border border-fg/20 px-4 py-2.5 text-[10px] uppercase tracking-[0.18em] text-fg/70 transition-colors hover:border-fg/50 hover:text-fg"
                >
                  {bioCopied ? <Check className="h-3.5 w-3.5" strokeWidth={1.5} /> : <Copy className="h-3.5 w-3.5" strokeWidth={1.5} />}
                  {bioCopied ? 'Bio copiada' : 'Copiar bio corta'}
                </button>
                <a
                  href={asset('/press/lucas-hess-fotos-prensa.zip')}
                  download
                  className="inline-flex items-center gap-2 border border-fg/20 px-4 py-2.5 text-[10px] uppercase tracking-[0.18em] text-fg/70 transition-colors hover:border-fg/50 hover:text-fg"
                >
                  <Download className="h-3.5 w-3.5" strokeWidth={1.5} />
                  Fotos de prensa (ZIP)
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="escuchar" className="py-16 md:py-24 px-5 md:px-12 lg:px-20 border-t border-fg/10">
        <div>
          <span className="text-[10px] uppercase tracking-[0.22em] text-fg/40">02 / Escuchar</span>
          <h2 className="mt-4 font-serif text-4xl md:text-6xl leading-none">Escuchar</h2>

          {/* Mobile: cabecera, reproductor, lista. Escritorio: cabecera + lista a la izquierda, reproductor a la derecha. */}
          <div className="mt-12 md:mt-16 grid gap-6 lg:grid-cols-[0.8fr_1.4fr] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-0 xl:gap-x-24">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 lg:col-start-1 lg:row-start-1 lg:flex-col lg:items-start lg:gap-y-2">
              <h3 className="font-serif text-2xl md:text-3xl">Deser0</h3>
              <span className="text-[10px] uppercase tracking-[0.2em] text-fg/40">EP · Diciembre 2025 · Tierso</span>
            </div>

            <div className="min-w-0 lg:col-start-2 lg:row-start-1 lg:row-span-2">
              <LiteYouTube key={track.id} id={track.id} title={track.title} initialActive={trackChosen} />
            </div>

            <div className="min-w-0 lg:col-start-1 lg:row-start-2 lg:mt-5">
              <ul className="border-t border-fg/10">
                {EP_TRACKS.map((item, index) => {
                  const current = item.id === track.id;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setTrack(item);
                          setTrackChosen(true);
                        }}
                        className="group flex w-full items-center justify-between gap-4 border-b border-fg/10 py-4 text-left"
                      >
                        <span className="flex min-w-0 items-baseline gap-4">
                          <span className="w-6 shrink-0 text-[10px] tabular-nums text-fg/40">{String(index + 1).padStart(2, '0')}</span>
                          <span className={`truncate font-serif text-lg md:text-xl transition-colors ${current ? 'text-fg' : 'text-fg/60 group-hover:text-fg'}`}>
                            {item.title}
                          </span>
                        </span>
                        <span className="shrink-0 text-[10px] uppercase tracking-[0.2em] text-fg/40 transition-colors group-hover:text-fg">
                          {current && trackChosen ? 'Reproduciendo' : item.kind}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-5 flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
                <p className="max-w-xl text-sm font-light leading-relaxed text-fg/60">
                  Música experimental con arreglos corales, percusiones sintéticas y espacialidad. Primer EP del proyecto Tierso.
                </p>
                <a
                  href={YOUTUBE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-fg/60 transition-colors hover:text-fg"
                >
                  Más en YouTube
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.25} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="galeria" className="py-16 md:py-24 border-t border-fg/10">
        <div className="px-5 md:px-12 lg:px-20 mb-14 md:mb-20">
          <span className="block mb-4 text-[10px] uppercase tracking-[0.22em] text-fg/40">03 / Portafolio</span>
          <h2 className="font-serif text-4xl md:text-6xl mb-5">Composiciones Visuales</h2>
          <p className="text-fg/60 max-w-xl font-light">Todo comenzó como un juego: creaciones a partir de consignas que, con el tiempo, derivaron en una exploración sostenida de texturas, maquillaje, expresiones y locaciones. Cuatro series que recorren ese proceso.</p>
          <p className="mt-4 text-fg/60 max-w-xl font-light">Todos los proyectos fueron concebidos y realizados bajo su dirección y autoría, en colaboración con fotógrafos, estilistas y otros artistas que acompañaron cada etapa.</p>
        </div>

        <div className="flex flex-col">
          {GALLERY_CATEGORIES.map((cat, index) => (
            <motion.div
              key={cat.id}
              id={`category-${cat.id}`}
              className="py-14 md:py-20 pl-5 md:pl-12 lg:pl-20 border-b border-fg/10 flex flex-col lg:flex-row gap-8 lg:gap-14 lg:items-start min-w-0"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false, margin: "-10%" }}
              transition={{ duration: 1 }}
            >
              <div className="w-full lg:w-1/3 pr-5 md:pr-12 lg:pr-4 flex flex-col shrink-0">
                <span className="text-fg/40 uppercase tracking-widest text-[11px] mb-4">0{index + 1} // {cat.id}</span>
                <h3 className="font-serif text-3xl md:text-5xl mb-2">{cat.title}</h3>
                <span className="italic text-fg/60 text-lg md:text-xl mb-5 font-serif">{cat.subtitle}</span>
                <p className="font-light text-fg/60 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <CategoryFrames images={cat.images} title={cat.title} />
            </motion.div>
          ))}
        </div>
      </section>

      <section id="conectar" className="py-16 md:py-28 px-5 md:px-12 lg:px-20 border-t border-fg/10">
        <div>
          <span className="text-[10px] uppercase tracking-[0.22em] text-fg/40">04 / Conectar</span>
          <h2 className="mt-4 font-serif text-4xl md:text-6xl leading-none">Conectar</h2>

          <div className="mt-12 md:mt-16 grid gap-10 md:grid-cols-[1.4fr_1fr] md:gap-16 xl:gap-24">
            <div className="min-w-0">
              <span className="text-[10px] uppercase tracking-[0.2em] text-fg/40">Booking · Prensa · Colaboraciones</span>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="group mt-4 flex items-center gap-3 font-serif text-[clamp(1.35rem,4vw,3.25rem)] leading-tight break-all transition-colors hover:text-fg/60"
              >
                {CONTACT_EMAIL}
                <ArrowUpRight
                  className="h-5 w-5 md:h-7 md:w-7 shrink-0 text-fg/40 transition-all group-hover:text-fg group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  strokeWidth={1}
                />
              </a>
              <p className="mt-5 max-w-md font-light leading-relaxed text-fg/60">
                Consultas por presentaciones en vivo, grabaciones, actuaciones y proyectos interdisciplinarios.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 self-start">
              {[
                { icon: Instagram, label: 'Instagram', handle: '@tiers0', href: INSTAGRAM_URL },
                { icon: Youtube, label: 'YouTube', handle: '@tierso-rayo', href: YOUTUBE_URL },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex flex-col gap-6 p-5 sm:p-6 border border-fg/10 hover:border-fg/30 transition-colors"
                >
                  <social.icon className="w-5 h-5 text-fg/60 group-hover:text-fg transition-colors" strokeWidth={1.25} />
                  <span className="flex flex-col gap-1">
                    <span className="text-[10px] tracking-[0.16em] uppercase text-fg/60 group-hover:text-fg transition-colors">{social.label}</span>
                    <span className="text-xs font-light text-fg/40">{social.handle}</span>
                  </span>
                </a>
              ))}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="group col-span-2 flex items-center justify-between gap-4 p-5 sm:p-6 border border-fg/10 hover:border-fg/30 transition-colors"
              >
                <span className="flex items-center gap-4">
                  <Mail className="w-5 h-5 text-fg/60 group-hover:text-fg transition-colors" strokeWidth={1.25} />
                  <span className="text-[10px] tracking-[0.16em] uppercase text-fg/60 group-hover:text-fg transition-colors">Escribir un correo</span>
                </span>
                <ArrowUpRight className="w-4 h-4 text-fg/40 group-hover:text-fg transition-colors" strokeWidth={1.25} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 text-center text-fg/40 text-[11px] tracking-[0.18em] uppercase border-t border-fg/10">
        <p>© {new Date().getFullYear()} Lucas Hess. Buenos Aires.</p>
      </footer>

    </div>
  );
}
