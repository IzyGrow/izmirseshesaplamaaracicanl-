export default function Header() {
  return (
    <header className="w-full border-b bg-background px-4 py-6 md:px-6 md:py-8">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <img 
          src="/izmirses-logo.jpeg" 
          alt="İzmirses İşitme Cihazları" 
          className="h-12 object-contain"
        />
        <nav className="flex gap-6">
          <a 
            href="https://izmirses.com.tr/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm hover:underline"
          >
            Ana Sayfa
          </a>
          <a 
            href="https://izmirses.com.tr/hakkimizda/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm hover:underline"
          >
            Hakkımızda
          </a>
          <a 
            href="https://izmirses.com.tr/iletisim/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm hover:underline"
          >
            İletişim
          </a>
        </nav>
      </div>
    </header>
  );
}
