export function Stats() {
  return (
    <section id="landingStats" className="bg-white mt-36 dark:bg-gray-900">
      <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-center text-gray-900 lg:mb-16 dark:text-white md:text-4xl">
        Stats that matters
      </h2>
      <div className="max-w-screen-xl px-4 py-8 mx-auto text-center lg:py-8 lg:px-6">
        <dl className="grid max-w-screen-md gap-8 mx-auto text-gray-900 sm:grid-cols-3 dark:text-white">
          <div className="flex flex-col items-center justify-center">
            <dt className="mb-2 text-3xl font-extrabold md:text-4xl">5K+</dt>
            <dd className="font-light text-gray-500 dark:text-gray-400">
              developers
            </dd>
          </div>
          <div className="flex flex-col items-center justify-center">
            <dt className="mb-2 text-3xl font-extrabold md:text-4xl">10M+</dt>
            <dd className="font-light text-gray-500 dark:text-gray-400">
              testers
            </dd>
          </div>
          <div className="flex flex-col items-center justify-center">
            <dt className="mb-2 text-3xl font-extrabold md:text-4xl">250+</dt>
            <dd className="font-light text-gray-500 dark:text-gray-400">
              companies
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
