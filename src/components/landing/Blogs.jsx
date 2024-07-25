import Image from "next/image";

export function Blogs() {
  return (
    <section id="landingBlogs" className="bg-white ">
      <div className="max-w-screen-xl px-4 py-8 mx-auto lg:py-16 lg:px-6">
        <div className="max-w-screen-sm mx-auto mb-8 text-center lg:mb-16">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 lg:text-4xl ">
            Our Blogs
          </h2>
          <p className="font-light text-gray-500 sm:text-xl ">
            Uncover actionable insights of industry trends through Uplift &
            insightful blogs empowering you to make data-driven decisions &
            elevate your content strategy.
          </p>
        </div>
        <div className="grid gap-12 mx-auto lg:grid-cols-2 md:mx-10">
          <article className="p-6 bg-white border border-gray-200 rounded-lg shadow-md ">
            <div className="flex items-center justify-between mb-5 text-gray-500">
              <span className="bg-primary-100 text-primary-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded ">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
                </svg>
                Tutorial
              </span>
              <span className="text-sm">1 days ago</span>
            </div>
            <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">
              <a href="#">
                Unlock the Power of Targeted Testing: A Guide for Businesses
              </a>
            </h2>
            <p className="mb-5 font-light text-gray-500 ">
              Struggling to gather relevant feedback for your product or
              content? This tutorial dives deep into Uplift&rsquo;s targeted
              testing features, showing you how to connect with the perfect
              audience for actionable insights. Learn how to define your target
              demographics, set up targeted testing campaigns, and analyze the
              results to make data-driven decisions that enhance your product or
              content strategy.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Image
                  className="rounded-full w-7 h-7"
                  src="/images/author/jese-leos.png"
                  alt="Jese Leos avatar"
                  height={28}
                  width={28}
                />
                <span className="font-medium ">Jese Leos</span>
              </div>
              <a
                href="#"
                className="inline-flex items-center font-medium text-primary-600 hover:underline"
              >
                Read more
                <svg
                  className="w-4 h-4 ml-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </a>
            </div>
          </article>
          <article className="p-6 bg-white border border-gray-200 rounded-lg shadow-md ">
            <div className="flex items-center justify-between mb-5 text-gray-500">
              <span className="bg-primary-100 text-primary-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded ">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z"
                    clipRule="evenodd"
                  ></path>
                  <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z"></path>
                </svg>
                Article
              </span>
              <span className="text-sm">4 days ago</span>
            </div>
            <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">
              <a href="#">
                The Value of Community in Testing: Why Uplift Makes a Difference
              </a>
            </h2>
            <p className="mb-5 font-light text-gray-500">
              This article explores the transformative power of community-driven
              testing offered by Uplift. Discover how Uplift&rsquo;s passionate
              community of testers goes beyond traditional methods, providing
              diverse perspectives and valuable feedback that traditional
              internal testing simply can&rsquo;t replicate. Learn how Uplift
              fosters a collaborative environment, leading to increased
              engagement and ultimately, a more successful product or campaign
              launch.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Image
                  className="rounded-full w-7 h-7"
                  src="/images/author/bonnie-green.png"
                  alt="Bonnie Green avatar"
                  height={28}
                  width={28}
                />
                <span className="font-medium ">Bonnie Green</span>
              </div>
              <a
                href="#"
                className="inline-flex items-center font-medium text-primary-600 hover:underline"
              >
                Read more
                <svg
                  className="w-4 h-4 ml-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
