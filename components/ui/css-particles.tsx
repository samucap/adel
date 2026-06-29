import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CssParticleProps {
  className?: string;
}

/**
 * Simple CSS/Framer‑Motion particle effect used on non‑login routes.
 * Generates a handful of animated dots that float and fade.
 */
export function CssParticles({ className }: CssParticleProps) {
  const particles = Array.from({ length: 12 });
  return (
    <div className={cn("pointer-events-none absolute inset-0", className)}>
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 rounded-full bg-[#DCF763] opacity-60"
          initial={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
          animate={{
            opacity: [0.3, 0.7, 0.3],
            scale: [0.5, 1.2, 0.5],
            x: [0, 20 * Math.cos((i / 12) * Math.PI * 2)],
            y: [0, 20 * Math.sin((i / 12) * Math.PI * 2)],
          }}
          transition={{ repeat: Infinity, duration: 4 + i, ease: "easeInOut" }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
}
