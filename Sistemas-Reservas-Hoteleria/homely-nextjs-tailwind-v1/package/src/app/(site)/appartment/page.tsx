import HeroSub from "@/components/shared/HeroSub";
import Appartment from "@/components/Properties/Appartment";
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
            <Appartment />
        </>
    );
};

export default page;