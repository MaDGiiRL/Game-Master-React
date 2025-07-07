import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import logo from "../public/logo.png";
export default function Footer() {
    return (
        <footer className=" text-white py-10 relative z-10 select-none bottom-0">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:justify-center md:items-center gap-6 md:gap-0">

                {/* Logo + Copyright */}
                <div className="flex flex-col md:flex-row items-center md:items-center text-center md:text-left space-y-2 md:space-y-0 md:space-x-3">
                    {/* Logo SVG o immagine */}
                    <div className="w-20 h-14 flex-shrink-0">
                        <img
                            src={logo}
                            alt="Logo Game Master"
                            style={{ width: "100px" }}
                            className="rounded-full"
                        />
                    </div>

                    <div>
                        <h1 className="text-3xl font-extrabold tracking-wide text-white select-none">
                            Game{" "}
                            <span className="text-purple-400 drop-shadow-md">Master</span>
                        </h1>
                        <p className="text-sm text-indigo-200">
                            &copy; 2025 <span className="font-semibold text-purple-400">Game Master</span>. All rights reserved.
                        </p>
                        <p className="text-xs text-indigo-300">
                            Developed with <span aria-label="love" role="img" className="text-purple-400">❤️</span> by <span className="font-semibold text-purple-400">Sofia Vidotto</span>
                        </p>
                    </div>
                </div>

                {/* Linea sottile animata */}
                <div className="hidden md:block w-px h-16 bg-gradient-to-b from-pink-400 via-purple-400 to-indigo-400 animate-pulse mx-5" />

                {/* Social media */}
                <div className="flex justify-center md:justify-center space-x-6">
                    {[
                        {
                            icon: <FaGithub />,
                            label: "GitHub",
                            href: "https://github.com/MaDGiiRL",
                        },
                        {
                            icon: <FaInstagram />,
                            label: "Instagram",
                            href: "https://www.instagram.com/lasignora_delpaiolo/",
                        },
                        {
                            icon: <FaLinkedin />,
                            label: "LinkedIn",
                            href: "https://www.linkedin.com/in/sofia-vidotto-ba1369351/",
                        },
                    ].map(({ icon, label, href }) => (
                        <a
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={label}
                            className="text-indigo-300 hover:text-pink-400 transition-colors duration-300 text-2xl transform hover:scale-110 active:scale-95"
                            title={label}
                        >
                            {icon}
                        </a>
                    ))}
                </div>
            </div>

            {/* Barra animata orizzontale */}
            <div className="mt-8 h-1 w-full max-w-4xl mx-auto rounded-full bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 animate-gradient-x" />

            <style>{`
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 6s ease infinite;
        }
      `}</style>
        </footer>
    );
}
