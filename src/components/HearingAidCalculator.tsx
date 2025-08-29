import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calculator, Phone, Mail, CheckCircle, FileText } from "lucide-react";

interface CalculationData {
  beneficiary: "self" | "relative";
  ageGroup: "0-4" | "5-12" | "13-18" | "18+";
  workStatus: "working" | "retired";
  phone: string;
  email: string;
  kvkkConsent: boolean;
}

interface PaymentAmount {
  netPaid: number;
  salaryDeduction: number;
}

const paymentRates: Record<string, Record<string, PaymentAmount>> = {
  "18+": {
    working: { netPaid: 3391.36, salaryDeduction: 0 },
    retired: { netPaid: 4239.20, salaryDeduction: 423.92 }
  },
  "13-18": {
    working: { netPaid: 5087.04, salaryDeduction: 0 },
    retired: { netPaid: 6358.80, salaryDeduction: 635.88 }
  },
  "5-12": {
    working: { netPaid: 5426.17, salaryDeduction: 0 },
    retired: { netPaid: 6782.72, salaryDeduction: 678.27 }
  },
  "0-4": {
    working: { netPaid: 6104.44, salaryDeduction: 0 },
    retired: { netPaid: 7630.56, salaryDeduction: 763.05 }
  }
};

type StepType = "contact" | "beneficiary" | "ageGroup" | "workStatus" | "kvkk" | "results";

export default function HearingAidCalculator() {
  const [step, setStep] = useState<StepType>("contact");
  const [data, setData] = useState<CalculationData>({
    beneficiary: "self",
    ageGroup: "18+",
    workStatus: "working",
    phone: "",
    email: "",
    kvkkConsent: false
  });

  const handleContactSubmit = () => {
    if (data.phone) {
      setStep("beneficiary");
    }
  };

  const handleBeneficiarySubmit = () => {
    setStep("ageGroup");
  };

  const handleAgeGroupSubmit = () => {
    setStep("workStatus");
  };

  const handleWorkStatusSubmit = () => {
    setStep("kvkk");
  };

  const handleKvkkSubmit = () => {
    if (data.kvkkConsent) {
      setStep("results");
    }
  };

  const calculation = paymentRates[data.ageGroup]?.[data.workStatus];

  const resetCalculator = () => {
    setStep("contact");
    setData({
      beneficiary: "self",
      ageGroup: "18+",
      workStatus: "working",
      phone: "",
      email: "",
      kvkkConsent: false
    });
  };

  const handleWhatsAppSubmit = () => {
    if (!calculation) return;

    const beneficiaryText = data.beneficiary === "self" ? "Kendisi" : "Yakını";
    const workStatusText = data.workStatus === "working" ? "Çalışan" : "Emekli";
    
    const message = `İşitme Cihazı Hesaplama Sonuçları%0A%0A📊 Hesaplama Sonuçları:%0A• Net Ödenen: ${calculation.netPaid.toLocaleString('tr-TR')} ₺%0A• Maaştan Kesinti: ${calculation.salaryDeduction.toLocaleString('tr-TR')} ₺%0A%0A📋 Hesaplama Detayları:%0A• Faydalanıcı: ${beneficiaryText}%0A• Yaş Grubu: ${data.ageGroup}%0A• Çalışma Durumu: ${workStatusText}%0A• Telefon: ${data.phone}%0A• E-posta: ${data.email || 'Girilmedi'}%0A%0A💡 Bilgi almak istiyorum.`;

    const whatsappUrl = `https://api.whatsapp.com/send/?phone=905050359990&text=${message}&type=phone_number&app_absent=0`;
    window.open(whatsappUrl, "_blank");
  };

  const getStepNumber = (currentStep: StepType): number => {
    const stepOrder: StepType[] = ["contact", "beneficiary", "ageGroup", "workStatus", "kvkk", "results"];
    return stepOrder.indexOf(currentStep) + 1;
  };

  const getPreviousStep = (currentStep: StepType): StepType | null => {
    const stepOrder: StepType[] = ["contact", "beneficiary", "ageGroup", "workStatus", "kvkk", "results"];
    const currentIndex = stepOrder.indexOf(currentStep);
    return currentIndex > 0 ? stepOrder[currentIndex - 1] : null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background p-2 sm:p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 mb-3 sm:mb-4">
            <Calculator className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
            <h1 className="text-2xl sm:text-3xl font-bold text-black">
              İşitme Cihazı Hesaplayıcı
            </h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">
            İşitme cihazı ödeme tutarlarınızı kolayca hesaplayın
          </p>
        </div>

        {step === "contact" && (
          <Card className="shadow-elegant">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Phone className="h-5 w-5 text-red-500" />
                İletişim Bilgileri
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Hesaplama sonuçlarını sizinle paylaşabilmemiz için iletişim bilgilerinizi girin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm sm:text-base">Telefon Numarası</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="0555 123 45 67"
                  value={data.phone}
                  onChange={(e) => setData({ ...data, phone: e.target.value })}
                  className="h-12 sm:h-10 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm sm:text-base">E-posta Adresi (Zorunlu Değil)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ornek@email.com"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  className="h-12 sm:h-10 text-base"
                />
              </div>
              <Button 
                onClick={handleContactSubmit}
                disabled={!data.phone}
                className="w-full h-14 sm:h-12 bg-red-500 hover:bg-red-600 transition-all text-base sm:text-sm font-semibold"
              >
                {getStepNumber(step)}. Adım - Devam Et
              </Button>
            </CardContent>
          </Card>
        )}

        {step === "beneficiary" && (
          <Card className="shadow-elegant">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl">Hesaplama Detayları</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Ödeme tutarını hesaplayabilmemiz için aşağıdaki bilgileri girin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-sm sm:text-base font-medium">Kimler için hesaplıyorsunuz?</Label>
                <RadioGroup
                  value={data.beneficiary}
                  onValueChange={(value: "self" | "relative") => setData({ ...data, beneficiary: value })}
                >
                  <div className="flex items-center space-x-3 py-2">
                    <RadioGroupItem value="self" id="self" className="h-5 w-5" />
                    <Label htmlFor="self" className="text-base cursor-pointer">Kendim için</Label>
                  </div>
                  <div className="flex items-center space-x-3 py-2">
                    <RadioGroupItem value="relative" id="relative" className="h-5 w-5" />
                    <Label htmlFor="relative" className="text-base cursor-pointer">Yakınım için</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setStep("contact")} 
                  className="flex-1 h-14 sm:h-12 text-base sm:text-sm font-semibold"
                >
                  Geri
                </Button>
                <Button 
                  onClick={handleBeneficiarySubmit}
                  className="flex-1 h-14 sm:h-12 bg-red-500 hover:bg-red-600 transition-all text-base sm:text-sm font-semibold"
                >
                  {getStepNumber(step)}. Adım - Devam Et
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "ageGroup" && (
          <Card className="shadow-elegant">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl">Hesaplama Detayları</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Ödeme tutarını hesaplayabilmemiz için aşağıdaki bilgileri girin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-sm sm:text-base font-medium">Yaş Grubu</Label>
                <Select value={data.ageGroup} onValueChange={(value: any) => setData({ ...data, ageGroup: value })}>
                  <SelectTrigger className="h-12 sm:h-10 text-base">
                    <SelectValue placeholder="Yaş grubunu seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-4" className="text-base py-3">0-4 Yaş</SelectItem>
                    <SelectItem value="5-12" className="text-base py-3">5-12 Yaş</SelectItem>
                    <SelectItem value="13-18" className="text-base py-3">13-18 Yaş</SelectItem>
                    <SelectItem value="18+" className="text-base py-3">18+ Yaş</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setStep("beneficiary")} 
                  className="flex-1 h-14 sm:h-12 text-base sm:text-sm font-semibold"
                >
                  Geri
                </Button>
                <Button 
                  onClick={handleAgeGroupSubmit}
                  className="flex-1 h-14 sm:h-12 bg-red-500 hover:bg-red-600 transition-all text-base sm:text-sm font-semibold"
                >
                  {getStepNumber(step)}. Adım - Devam Et
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "workStatus" && (
          <Card className="shadow-elegant">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl">Hesaplama Detayları</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Ödeme tutarını hesaplayabilmemiz için aşağıdaki bilgileri girin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-sm sm:text-base font-medium">Çalışma Durumu</Label>
                <RadioGroup
                  value={data.workStatus}
                  onValueChange={(value: "working" | "retired") => setData({ ...data, workStatus: value })}
                >
                  <div className="flex items-center space-x-3 py-2">
                    <RadioGroupItem value="working" id="working" className="h-5 w-5" />
                    <Label htmlFor="working" className="text-base cursor-pointer">Çalışan</Label>
                  </div>
                  <div className="flex items-center space-x-3 py-2">
                    <RadioGroupItem value="retired" id="retired" className="h-5 w-5" />
                    <Label htmlFor="retired" className="text-base cursor-pointer">Emekli</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setStep("ageGroup")} 
                  className="flex-1 h-14 sm:h-12 text-base sm:text-sm font-semibold"
                >
                  Geri
                </Button>
                <Button 
                  onClick={handleWorkStatusSubmit}
                  className="flex-1 h-14 sm:h-12 bg-red-500 hover:bg-red-600 transition-all text-base sm:text-sm font-semibold"
                >
                  {getStepNumber(step)}. Adım - Devam Et
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "kvkk" && (
          <Card className="shadow-elegant">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl">Hesaplama Detayları</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Ödeme tutarını hesaplayabilmemiz için aşağıdaki bilgileri girin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <h3 className="font-semibold flex items-center gap-2 text-sm sm:text-base">
                  <Mail className="h-4 w-4" />
                  İletişim Bilgileriniz
                </h3>
                <p className="text-sm text-muted-foreground">Telefon: {data.phone}</p>
                <p className="text-sm text-red-500">E-posta: {data.email}</p>
              </div>

              <div className="space-y-3">
                <div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="link" className="h-auto p-0 text-xs sm:text-sm text-red-500">
                        <FileText className="h-3 w-3 mr-1" />
                        KVKK aydınlatma metnini oku
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh]">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Kişisel Verilerin Korunması Kanunu (KVKK)
                        </DialogTitle>
                        <DialogDescription>
                          Aydınlatma Yükümlülüğünün Yerine Getirilmesinde Uyulacak Usul ve Esaslar Hakkında Tebliğ
                        </DialogDescription>
                      </DialogHeader>
                      <ScrollArea className="h-[60vh] mt-4">
                        <div className="space-y-4 text-sm">
                          <div>
                            <h3 className="font-bold text-base mb-2">AYDINLATMA YÜKÜMLÜLÜĞÜNÜN YERİNE GETİRİLMESİNDE UYULACAK USUL VE ESASLAR HAKKINDA TEBLİĞ</h3>
                            
                            <h4 className="font-semibold mt-4 mb-2">Amaç ve kapsam</h4>
                            <p><strong>MADDE 1 –</strong> Bu Tebliğin amacı, 24/3/2016 tarihli ve 6698 sayılı Kişisel Verilerin Korunması Kanununun 10 uncu maddesi uyarınca veri sorumluları veya yetkilendirdiği kişilerce yerine getirilmesi gereken aydınlatma yükümlülüğü kapsamında uyulacak usul ve esasları belirlemektir.</p>
                            
                            <h4 className="font-semibold mt-4 mb-2">Dayanak</h4>
                            <p><strong>MADDE 2 –</strong> Bu Tebliğ, 6698 sayılı Kişisel Verilerin Korunması Kanununun 22 nci maddesinin birinci fıkrasının (e) ve (g) bentlerine dayanılarak hazırlanmıştır.</p>
                            
                            <h4 className="font-semibold mt-4 mb-2">Tanımlar</h4>
                            <p><strong>MADDE 3 –</strong> Bu Tebliğde geçen;</p>
                            <ul className="list-disc ml-6 space-y-1">
                              <li><strong>Alıcı grubu:</strong> Veri sorumlusu tarafından kişisel verilerin aktarıldığı gerçek veya tüzel kişi kategorisini,</li>
                              <li><strong>İlgili kişi:</strong> Kişisel verisi işlenen gerçek kişiyi,</li>
                              <li><strong>Kanun:</strong> 24/3/2016 tarihli ve 6698 sayılı Kişisel Verilerin Korunması Kanununu,</li>
                              <li><strong>Kurul:</strong> Kişisel Verileri Koruma Kurulunu,</li>
                              <li><strong>Kurum:</strong> Kişisel Verileri Koruma Kurumunu,</li>
                              <li><strong>Veri sorumlusu:</strong> Kişisel verilerin işleme amaçlarını ve vasıtalarını belirleyen, veri kayıt sisteminin kurulmasından ve yönetilmesinden sorumlu olan gerçek veya tüzel kişiyi ifade eder.</li>
                            </ul>
                            
                            <h4 className="font-semibold mt-4 mb-2">Aydınlatma yükümlülüğünün kapsamı</h4>
                            <p><strong>MADDE 4 –</strong> Kanunun 10 uncu maddesine göre; kişisel verilerin elde edilmesi sırasında veri sorumluları veya yetkilendirdiği kişilerce, ilgili kişilerin bilgilendirilmesi gerekmektedir. Bu yükümlülük yerine getirilirken asgari olarak aşağıdaki konuları içermesi gerekmektedir:</p>
                            <ul className="list-disc ml-6 space-y-1">
                              <li>Veri sorumlusunun ve varsa temsilcisinin kimliği,</li>
                              <li>Kişisel verilerin hangi amaçla işleneceği,</li>
                              <li>Kişisel verilerin kimlere ve hangi amaçla aktarılabileceği,</li>
                              <li>Kişisel veri toplamanın yöntemi ve hukuki sebebi,</li>
                              <li>İlgili kişinin Kanunun 11 inci maddesinde sayılan diğer hakları.</li>
                            </ul>
                            
                            <h4 className="font-semibold mt-4 mb-2">Usul ve esaslar</h4>
                            <p><strong>MADDE 5 –</strong> Veri sorumlusu ya da yetkilendirdiği kişi tarafından aydınlatma yükümlülüğünün yerine getirilmesi esnasında aşağıda sayılan usul ve esaslara uyulması gerekmektedir:</p>
                            <ul className="list-disc ml-6 space-y-2">
                              <li>İlgili kişinin açık rızasına veya Kanundaki diğer işleme şartlarına bağlı olarak kişisel veri işlendiği her durumda aydınlatma yükümlülüğü yerine getirilmelidir.</li>
                              <li>Kişisel veri işleme amacı değiştiğinde, veri işleme faaliyetinden önce bu amaç için aydınlatma yükümlülüğü ayrıca yerine getirilmelidir.</li>
                              <li>Aydınlatma yükümlülüğünün yerine getirilmesi, ilgili kişinin talebine bağlı değildir.</li>
                              <li>Aydınlatma yükümlülüğünün yerine getirildiğinin ispatı veri sorumlusuna aittir.</li>
                              <li>Aydınlatma yükümlülüğü kapsamında açıklanacak kişisel veri işleme amacının belirli, açık ve meşru olması gerekir.</li>
                              <li>Aydınlatma yükümlülüğü kapsamında ilgili kişiye yapılacak bildirimin anlaşılır, açık ve sade bir dil kullanılarak gerçekleştirilmesi gerekmektedir.</li>
                              <li>Aydınlatma yükümlülüğü yerine getirilirken eksik, ilgili kişileri yanıltıcı ve yanlış bilgilere yer verilmemelidir.</li>
                            </ul>
                            
                            <p className="mt-4 text-xs text-muted-foreground">
                              Kaynak: T.C. Resmî Gazete, 10 Mart 2018, Sayı: 30356
                            </p>
                          </div>
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="flex items-center space-x-3 py-2">
                  <Checkbox
                    id="kvkk"
                    checked={data.kvkkConsent}
                    onCheckedChange={(checked) => setData({ ...data, kvkkConsent: checked as boolean })}
                    className="h-5 w-5"
                  />
                  <Label htmlFor="kvkk" className="text-sm sm:text-base cursor-pointer">
                    KVKK kapsamında kişisel verilerimin kullanılmasını kabul ediyorum
                  </Label>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setStep("workStatus")} 
                  className="flex-1 h-14 sm:h-12 text-base sm:text-sm font-semibold"
                >
                  Geri
                </Button>
                <Button 
                  onClick={handleKvkkSubmit}
                  disabled={!data.kvkkConsent}
                  className="flex-1 h-14 sm:h-12 bg-red-500 hover:bg-red-600 transition-all text-base sm:text-sm font-semibold"
                >
                  {getStepNumber(step)}. Adım - Hesapla
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "results" && calculation && (
          <Card className="shadow-elegant">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Hesaplama Sonuçları
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                {data.ageGroup} yaş grubu - {data.workStatus === "working" ? "Çalışan" : "Emekli"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                  <h3 className="font-semibold text-red-500 mb-2 text-sm sm:text-base">Net Ödenen</h3>
                  <p className="text-xl sm:text-2xl font-bold">{calculation.netPaid.toLocaleString('tr-TR')} ₺</p>
                </div>
                <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                  <h3 className="font-semibold text-accent mb-2 text-sm sm:text-base">Maaştan Kesinti</h3>
                  <p className="text-xl sm:text-2xl font-bold">{calculation.salaryDeduction.toLocaleString('tr-TR')} ₺</p>
                </div>
              </div>

              <Separator />

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3 text-sm sm:text-base">Hesaplama Detayları</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Faydalanıcı:</span> {data.beneficiary === "self" ? "Kendisi" : "Yakını"}</p>
                  <p><span className="font-medium">Yaş Grubu:</span> {data.ageGroup}</p>
                  <p><span className="font-medium">Çalışma Durumu:</span> {data.workStatus === "working" ? "Çalışan" : "Emekli"}</p>
                  <p><span className="font-medium">Telefon:</span> {data.phone}</p>
                  <p><span className="font-medium">E-posta:</span> {data.email}</p>
                </div>
              </div>

              <div className="text-center space-y-4">
                <p className="text-xs text-muted-foreground">
                  PIL 104 ADET/YIL X 5,00 ₺ = 520,00 ₺ + 104,00 (KDV %20) = 624,00 ₺
                </p>
                <Button 
                  onClick={handleWhatsAppSubmit}
                  className="w-full h-14 sm:h-12 bg-red-500 hover:bg-red-600 transition-all text-base sm:text-sm font-semibold"
                >
                  Bilgi Almak İstiyorum
                </Button>
                <Button 
                  onClick={resetCalculator}
                  variant="outline"
                  className="w-full h-14 sm:h-12 text-base sm:text-sm font-semibold"
                >
                  Yeni Hesaplama Yap
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}