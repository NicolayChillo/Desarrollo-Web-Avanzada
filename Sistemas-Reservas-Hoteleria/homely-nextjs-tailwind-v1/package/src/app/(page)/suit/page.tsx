import HeroSub from "@/components/shared/HeroSub";
import ResidentialList from "@/components/Habitaciones/suit";
import React from "react";
import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Property List | Homely",
};

const page = () => {
    return (
        <>
            <HeroSub
                title="Suites Exclusivas."
                description="Experimente la elegancia y la comodidad con nuestras exclusivas suites de lujo, diseñadas para una vida sofisticada."
                badge=""
            />
            <ResidentialList />
        </>
    );  
};

export default page;