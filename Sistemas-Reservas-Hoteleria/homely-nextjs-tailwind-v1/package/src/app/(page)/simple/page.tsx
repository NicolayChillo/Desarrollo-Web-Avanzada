import HeroSub from "@/components/shared/HeroSub";
import Simple from "@/components/Habitaciones/Simple";
import React from "react";
import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Property List | Homely",
};

const page = () => {
    return (
        <>
            <HeroSub
                title="Habitaciones Simples."
                description="Cómoda y funcional, ideal para viajeros que buscan descanso, tranquilidad y un ambiente acogedor."
                badge="Properties"
            />
            <Simple />
        </>
    );
};

export default page;