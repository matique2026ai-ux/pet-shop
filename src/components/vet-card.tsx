"use client";

import Image from "next/image";
import { Clock, Stethoscope, Syringe, Bone, Scissors, Apple, FlaskRound, Smartphone, Sword, Sparkles } from "lucide-react";
import type { VetService } from "@/lib/data";
import { useI18n } from "@/lib/i18n-context";

const serviceImages: Record<string, string> = {
  v1: "https://picsum.photos/seed/vet-service1/600/400",
  v2: "https://picsum.photos/seed/vet-service2/600/400",
  v3: "https://picsum.photos/seed/vet-service3/600/400",
  v4: "https://picsum.photos/seed/vet-service4/600/400",
  v5: "https://picsum.photos/seed/vet-service5/600/400",
  v6: "https://picsum.photos/seed/vet-service6/600/400",
  v7: "https://picsum.photos/seed/vet-service7/600/400",
  v8: "https://picsum.photos/seed/vet-service8/600/400",
};

const iconMap: Record<string, React.ReactNode> = {
  stethoscope: <Stethoscope className="w-5 h-5" />,
  syringe: <Syringe className="w-5 h-5" />,
  tooth: <Bone className="w-5 h-5" />,
  scalpel: <Sword className="w-5 h-5" />,
  smartphone: <Smartphone className="w-5 h-5" />,
  flask: <FlaskRound className="w-5 h-5" />,
  scissors: <Scissors className="w-5 h-5" />,
  apple: <Apple className="w-5 h-5" />,
};

interface VetCardProps {
  service: VetService;
  index?: number;
}

export default function VetCard({ service }: VetCardProps) {
  const { t, currency } = useI18n();
  return (
    <div className="group relative overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-1.5"
      style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.25)" }}
    >
      <div className="relative h-72 overflow-hidden">
        <Image
          src={serviceImages[service.id] || serviceImages["vet-1"]}
          alt={service.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-all duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#003333]/90 via-[#004d4d]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#003333]/40" />

        <div className="absolute top-4 left-4">
          <span className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center text-white border border-white/30 shadow-lg">
            {iconMap[service.icon] || <Stethoscope className="w-5 h-5" />}
          </span>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xl font-bold text-white drop-shadow-lg">{service.title}</h3>
            <span className="text-2xl font-bold text-white drop-shadow-lg">{currency}{service.price}</span>
          </div>
          <p className="text-sm text-white/80 drop-shadow line-clamp-2">{service.description}</p>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-14 bg-white/80 backdrop-blur-xl border-t border-white/40 flex items-center justify-between px-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
        <span className="flex items-center gap-1.5 text-xs text-gray-600">
          <Clock className="w-3.5 h-3.5" />
          {service.duration}
        </span>
        <span className="flex items-center gap-1 text-xs font-semibold text-[#008080]">
          <Sparkles className="w-3 h-3" /> {t.vet.bookNow}
        </span>
      </div>
    </div>
  );
}
