"use client";

import Link from "next/link";
import { Trophy, Users, Shirt, ArrowRight, Sparkles, Swords } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-stadium flex flex-col">
      <nav className="absolute top-0 left-0 right-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm sm:text-base">
              <span className="text-gradient-gold">ADRENALYN</span>
              <span className="text-white/60 ml-1">CUP</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/cards"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Cartas
            </Link>
            <Link
              href="/tournaments"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-medium rounded-lg hover:from-blue-500 hover:to-violet-500 transition-all duration-200"
            >
              <Trophy className="w-4 h-4" />
              Torneos
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative flex-1 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/5 via-transparent to-violet-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-light text-xs font-medium text-blue-300 mb-8 border border-blue-500/20">
              <Sparkles className="w-3 h-3" />
              Temporada de Campeonato
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none mb-6"
          >
            <span className="text-white">WORLD CLUBS &</span>
            <br />
            <span className="text-gradient-gold">NATIONS CUP</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Crea tus cartas, construye plantillas híbridas de clubes y selecciones,
            compite en torneos globales y demuestra quién es el mejor manager.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/tournaments/new"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-violet-500 transition-all duration-200 shadow-lg shadow-blue-500/25"
            >
              <Trophy className="w-5 h-5" />
              Crear Torneo
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/cards"
              className="inline-flex items-center gap-2 px-8 py-3.5 glass-light text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-200 border border-white/10"
            >
              <Shirt className="w-5 h-5" />
              Ver Cartas
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-3.5 glass-light text-muted-foreground font-medium rounded-xl hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <Swords className="w-5 h-5" />
              Continuar
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {[
              { icon: Trophy, label: "Torneos Híbridos", desc: "8 a 32 equipos" },
              { icon: Shirt, label: "Cartas Premium", desc: "7 rarezas únicas" },
              { icon: Users, label: "Avatares Únicos", desc: "Generados desde cero" },
              { icon: Swords, label: "Partido Interactivo", desc: "Ronda a ronda" },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.label}
                  className="glass-light rounded-xl p-4 text-center"
                >
                  <Icon className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                  <div className="text-sm font-semibold text-white mb-0.5">
                    {feature.label}
                  </div>
                  <div className="text-xs text-muted-foreground">{feature.desc}</div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-muted-foreground">
          ADRENALYN CUP &copy; {new Date().getFullYear()} &mdash; World Clubs & Nations Championship
        </div>
      </footer>
    </div>
  );
}
