import React, { FC } from "react";
import { Blog } from "@/types/blog";
import { format } from "date-fns";
import Link from "next/link";
import { Icon } from "@iconify/react";

const BlogCard: FC<{ blog: Blog }> = ({ blog }) => {
    const { title, date, slug, tag } = blog;
    
    // Iconos según el tipo de tag/categoría
    const getIcon = (tagName: string) => {
        const tagLower = tagName.toLowerCase();
        if (tagLower.includes('wifi') || tagLower.includes('internet')) return 'ph:wifi-high-fill';
        if (tagLower.includes('comida') || tagLower.includes('desayuno')) return 'ph:fork-knife-fill';
        if (tagLower.includes('servicio') || tagLower.includes('atención')) return 'ph:user-circle-fill';
        if (tagLower.includes('ubicación') || tagLower.includes('lugar')) return 'ph:map-pin-fill';
        if (tagLower.includes('habitación') || tagLower.includes('room')) return 'ph:bed-fill';
        if (tagLower.includes('limpieza') || tagLower.includes('clean')) return 'ph:broom-fill';
        return 'ph:lightbulb-fill'; // Icono por defecto
    };

    return (
        <Link href={`/blogs/${slug}`} aria-label="blog card" className="gap-4 group block">
            <div className="overflow-hidden rounded-2xl flex-shrink-0 bg-gradient-to-br from-primary/10 to-blue-100 dark:from-primary/20 dark:to-blue-900/30 flex items-center justify-center aspect-video">
                <Icon 
                    icon={getIcon(tag)} 
                    className="text-primary dark:text-primary/80 transition-transform group-hover:scale-110"
                    width={80}
                    height={80}
                />
            </div>
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="mt-2 text-xl font-medium text-dark dark:text-white group-hover:text-primary">
                        {title}
                    </h3>
                    <span className="text-base font-medium dark:text-white/50 text-dark/50 leading-loose">
                        {format(new Date(date), "MMM dd, yyyy")}
                    </span>
                </div>
                <div className="py-2.5 px-5 bg-dark/5 rounded-full dark:bg-white/15">
                    <p className="text-sm font-semibold text-dark dark:text-white">{tag}</p>
                </div>
            </div>
        </Link>
    );
};

export default BlogCard;
