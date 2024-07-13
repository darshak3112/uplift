export default function FeatureCard({ icon, title, description }) {
  return (
    <div>
      <div className="flex items-center justify-center w-10 h-10 mb-4 rounded-full bg-primary-100 lg:h-12 lg:w-12 ">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-bold ">{title}</h3>
      <p className="text-gray-500 ">{description}</p>
    </div>
  );
}
