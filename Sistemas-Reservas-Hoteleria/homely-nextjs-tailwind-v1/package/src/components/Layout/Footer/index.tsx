import Link from "next/link";
import { Icon } from "@iconify/react";

const Footer = () => {
  return (
    <footer className="relative z-10 bg-dark">
      <div className="container mx-auto max-w-8xl pt-14 px-4 sm:px-6 lg:px-0">
        <div className="flex justify-between md:flex-nowrap flex-wrap items-center py-8 gap-6">
          <div className="flex gap-8 items-center">
            <Link href="#" className="text-white/40 hover:text-primary text-sm">
              Terminos y condiciones
            </Link>
            <Link href="#" className="text-white/40 hover:text-primary text-sm">
              Politica de privacidad ESPE - GRUPO 3
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="https://github.com/NicolayChillo/Desarrollo-Web-Avanzada.git"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon
                icon="ph:github-logo-bold"
                width={32}
                height={32}
                className="text-white hover:text-primary duration-300"
              />
            </Link>
            <Link
              href="https://facebook.com/tu-pagina"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon
                icon="ph:facebook-logo-bold"
                width={32}
                height={32}
                className="text-white hover:text-primary duration-300"
              />
            </Link>
            <Link
              href="https://instagram.com/tu-cuenta"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon
                icon="ph:instagram-logo-bold"
                width={32}
                height={32}
                className="text-white hover:text-primary duration-300"
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
