import { Footer } from "@/components/Footer";
import Header from "@/components/Header";
import HearingAidCalculator from "@/components/HearingAidCalculator";


const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Hesaplayıcı Section */}
        <section className="py-16 px-4">
          <HearingAidCalculator />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
