import HeroSub from "@/components/shared/HeroSub";
import OfficeSpace from "@/components/Habitaciones/Doble";
import React from "react";
import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Property List | Homely",
};

const page = () => {
    return (
        <>
            <HeroSub
                title="Habitaciones Dobles."
                description="Espaciosas y elegantes, perfectas para parejas o viajeros que buscan un ambiente más amplio y confortable."
                badge=""
            />
            <OfficeSpace />
        </>
    );
};

export default page;