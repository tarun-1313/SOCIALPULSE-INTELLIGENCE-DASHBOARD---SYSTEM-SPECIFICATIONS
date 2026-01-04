export default function PrivacyPage() {
  return (
    <div className="py-20 px-4 max-w-3xl mx-auto space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
        <p className="text-zinc-500 italic">Last updated: January 02, 2026</p>
      </div>

      <div className="prose prose-invert max-w-none space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">1. Data Collection</h2>
          <p className="text-zinc-400 leading-relaxed">
            We collect information you provide directly to us when you create an account, such as your name and email
            address. We also fetch public metrics from connected social media APIs to populate your dashboard.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">2. Use of Information</h2>
          <p className="text-zinc-400 leading-relaxed">
            The information we collect is used to provide, maintain, and improve our services, including the generation
            of visual analytics and automated performance reports.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">3. Security</h2>
          <p className="text-zinc-400 leading-relaxed">
            We implement industry-standard security measures, including password hashing (bcrypt) and JWT-based
            authentication, to protect your organizational data from unauthorized access.
          </p>
        </section>
      </div>
    </div>
  )
}
