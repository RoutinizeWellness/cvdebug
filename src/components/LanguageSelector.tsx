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

  // Safety check - if locale is undefined, don't render
  if (!locale || !localeNames[locale]) {
    return null;
  }

  return (
    <Select value={locale} onValueChange={(value) => setLocale(value as SupportedLocale)}>
      <SelectTrigger className="w-[140px] bg-background/50 backdrop-blur-sm border-border/50">
        <SelectValue>
          <div className="flex items-center gap-2">
            <span>{localeNames[locale].flag}</span>
            <span className="text-sm">{localeNames[locale].name}</span>
          </div>
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