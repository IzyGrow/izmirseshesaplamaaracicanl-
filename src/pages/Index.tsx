import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HearingAidCalculator from "@/components/HearingAidCalculator";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Ana içerik */}
      <main className="flex-grow flex flex-col items-center justify-center py-12 px-4 space-y-12">
        {/* Hearing Aid Calculator */}
        <HearingAidCalculator />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
