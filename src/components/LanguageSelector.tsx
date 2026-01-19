import { Globe } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useI18n } from "@/contexts/I18nContext";
import { SupportedLocale } from "@/lib/i18n";

const localeNames: Record<SupportedLocale, { flag: string; name: string }> = {
  'en-US': { flag: '🇺🇸', name: 'English (US)' },
  'en-GB': { flag: '🇬🇧', name: 'English (UK)' },
  'en-CA': { flag: '🇨🇦', name: 'English (CA)' },
  'en-AU': { flag: '🇦🇺', name: 'English (AU)' },
  'en-IN': { flag: '🇮🇳', name: 'English (IN)' },
  'es-ES': { flag: '🇪🇸', name: 'Español (ES)' },
  'es-MX': { flag: '🇲🇽', name: 'Español (MX)' },
  'fr-FR': { flag: '🇫🇷', name: 'Français' },
  'de-DE': { flag: '🇩🇪', name: 'Deutsch' },
  'pt-BR': { flag: '🇧🇷', name: 'Português' },
};

export function LanguageSelector() {
  const { locale, setLocale } = useI18n();

  return (
    <Select value={locale} onValueChange={(value) => setLocale(value as SupportedLocale)}>
      <SelectTrigger className="w-[180px] h-9 gap-2 border-[#E2E8F0]">
        <Globe className="h-4 w-4 text-[#64748B]" />
        <SelectValue>
          <span className="flex items-center gap-2">
            <span>{localeNames[locale].flag}</span>
            <span className="text-sm">{localeNames[locale].name}</span>
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <div className="px-2 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
          English
        </div>
        <SelectItem value="en-US">
          <span className="flex items-center gap-2">
            <span>🇺🇸</span> United States
          </span>
        </SelectItem>
        <SelectItem value="en-GB">
          <span className="flex items-center gap-2">
            <span>🇬🇧</span> United Kingdom
          </span>
        </SelectItem>
        <SelectItem value="en-CA">
          <span className="flex items-center gap-2">
            <span>🇨🇦</span> Canada
          </span>
        </SelectItem>
        <SelectItem value="en-AU">
          <span className="flex items-center gap-2">
            <span>🇦🇺</span> Australia
          </span>
        </SelectItem>
        <SelectItem value="en-IN">
          <span className="flex items-center gap-2">
            <span>🇮🇳</span> India
          </span>
        </SelectItem>

        <div className="px-2 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider border-t border-b border-slate-100 my-1">
          Español
        </div>
        <SelectItem value="es-ES">
          <span className="flex items-center gap-2">
            <span>🇪🇸</span> España
          </span>
        </SelectItem>
        <SelectItem value="es-MX">
          <span className="flex items-center gap-2">
            <span>🇲🇽</span> México
          </span>
        </SelectItem>

        <div className="px-2 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider border-t border-b border-slate-100 my-1">
          Autres Langues
        </div>
        <SelectItem value="fr-FR">
          <span className="flex items-center gap-2">
            <span>🇫🇷</span> Français
          </span>
        </SelectItem>
        <SelectItem value="de-DE">
          <span className="flex items-center gap-2">
            <span>🇩🇪</span> Deutsch
          </span>
        </SelectItem>
        <SelectItem value="pt-BR">
          <span className="flex items-center gap-2">
            <span>🇧🇷</span> Português
          </span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
