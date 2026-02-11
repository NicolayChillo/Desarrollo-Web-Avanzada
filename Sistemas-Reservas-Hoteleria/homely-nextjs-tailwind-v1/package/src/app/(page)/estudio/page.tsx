import HeroSub from "@/components/shared/HeroSub";
import LuxuryVillas from "@/components/Habitaciones/Estudio";
import React from "react";
import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Property List | Homely",
};

const page = () => {
    return (
        <>
            <HeroSub
                title="Habitaciones de Estudio"
                description="Espacio moderno y funcional en un solo ambiente, ideal para estancias prolongadas."
                badge=""
            />
            <LuxuryVillas />
        </>
    );
};

export default page;