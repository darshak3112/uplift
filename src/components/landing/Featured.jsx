import { features } from "@/_constants/landing/featuredList";
import TestimonyCard from "./FeatureCard";

export function Featured() {
  return (
    <section id="landingFeatured" className="mx-8 mt-5 bg-white">
      <div className="mx-auto mb-1 max-w-screen lg:mb-8">
        <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-center text-gray-900 lg:mb-8 md:text-4xl">
          Services designed for business teams like yours
        </h2>
      </div>
      <div className="max-w-screen-xl px-4 py-8 mx-auto sm:py-16 lg:px-6">
        <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
          {features.map((feature) => (
            <TestimonyCard key={feature?.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
