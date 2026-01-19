import { Globe } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useI18n } from "@/contexts/I18nContext";
import { SupportedLocale } from "@/lib/i18n";

const localeNames: Record<SupportedLocale, { flag: string; name: string }> = {
  'en': { flag: '🌍', name: 'English' },
  'es': { flag: '🇪🇸', name: 'Español' },
  'fr': { flag: '🇫🇷', name: 'Français' },
  'de': { flag: '🇩🇪', name: 'Deutsch' },
  'pt': { flag: '🇧🇷', name: 'Português' },
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
        <SelectItem value="en">
          <span className="flex items-center gap-2">
            <span>🌍</span> English
          </span>
        </SelectItem>
        <SelectItem value="es">
          <span className="flex items-center gap-2">
            <span>🇪🇸</span> Español
          </span>
        </SelectItem>
        <SelectItem value="fr">
          <span className="flex items-center gap-2">
            <span>🇫🇷</span> Français
          </span>
        </SelectItem>
        <SelectItem value="de">
          <span className="flex items-center gap-2">
            <span>🇩🇪</span> Deutsch
          </span>
        </SelectItem>
        <SelectItem value="pt">
          <span className="flex items-center gap-2">
            <span>🇧🇷</span> Português
          </span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
