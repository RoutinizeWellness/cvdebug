/**
 * Data Exporter Component
 * Exports analytics data in various formats
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileJson, FileText, Calendar, CheckCircle } from 'lucide-react';
import { mlAnalytics } from '@/lib/mlAnalytics';
import { seoAnalytics } from '@/lib/seoAnalytics';
import { toast } from 'sonner';

type ExportFormat = 'json' | 'csv';
type DataType = 'ml_analytics' | 'seo_analytics' | 'all';

export function DataExporter() {
  const [format, setFormat] = useState<ExportFormat>('json');
  const [dataType, setDataType] = useState<DataType>('ml_analytics');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);

    try {
      let data: string;
      let filename: string;
      const timestamp = new Date().toISOString().slice(0, 10);

      switch (dataType) {
        case 'ml_analytics':
          data = mlAnalytics.exportMetrics(format);
          filename = `ml-analytics-${timestamp}.${format}`;
          break;
        case 'seo_analytics':
          data = seoAnalytics.exportMetrics(format);
          filename = `seo-analytics-${timestamp}.${format}`;
          break;
        case 'all':
          if (format === 'json') {
            const combined = {
              mlAnalytics: JSON.parse(mlAnalytics.exportMetrics('json')),
              seoAnalytics: JSON.parse(seoAnalytics.exportMetrics('json')),
              exportedAt: new Date().toISOString()
            };
            data = JSON.stringify(combined, null, 2);
          } else {
            // For CSV, combine both datasets
            const mlCsv = mlAnalytics.exportMetrics('csv');
            const seoCsv = seoAnalytics.exportMetrics('csv');
            data = `ML ANALYTICS\n\n${mlCsv}\n\n\nSEO ANALYTICS\n\n${seoCsv}`;
          }
          filename = `combined-analytics-${timestamp}.${format}`;
          break;
      }

      // Create download
      const blob = new Blob([data], {
        type: format === 'json' ? 'application/json' : 'text/csv'
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);

      toast.success('Export Complete', {
        description: `Downloaded ${filename} successfully`
      });
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export Failed', {
        description: 'Failed to export data. Please try again.'
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="card-professional p-6">
      <div className="flex items-center gap-3 mb-6">
        <Download className="w-6 h-6 text-blue-500" />
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Export Analytics Data
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Download analytics data for external analysis
          </p>
        </div>
      </div>

      {/* Data Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
          Select Data Type
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <DataTypeCard
            icon={<FileText className="w-5 h-5" />}
            title="ML Analytics"
            description="Model performance, latency, accuracy"
            selected={dataType === 'ml_analytics'}
            onClick={() => setDataType('ml_analytics')}
          />
          <DataTypeCard
            icon={<FileText className="w-5 h-5" />}
            title="SEO Analytics"
            description="SEO scores, keyword metrics"
            selected={dataType === 'seo_analytics'}
            onClick={() => setDataType('seo_analytics')}
          />
          <DataTypeCard
            icon={<FileText className="w-5 h-5" />}
            title="All Data"
            description="Combined analytics export"
            selected={dataType === 'all'}
            onClick={() => setDataType('all')}
          />
        </div>
      </div>

      {/* Format Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
          Export Format
        </label>
        <div className="flex items-center gap-3">
          <FormatButton
            icon={<FileJson className="w-4 h-4" />}
            label="JSON"
            description="Best for programmatic access"
            selected={format === 'json'}
            onClick={() => setFormat('json')}
          />
          <FormatButton
            icon={<FileText className="w-4 h-4" />}
            label="CSV"
            description="Best for Excel/spreadsheets"
            selected={format === 'csv'}
            onClick={() => setFormat('csv')}
          />
        </div>
      </div>

      {/* Export Info */}
      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-slate-500 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">
              Export Information
            </p>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Includes all historical data up to current time</li>
              <li>• File will be named with today's date</li>
              <li>• {format.toUpperCase()} format compatible with most tools</li>
              {dataType === 'all' && (
                <li>• Combined export includes both ML and SEO data</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Export Button */}
      <button
        onClick={handleExport}
        disabled={isExporting}
        className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {isExporting ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Download className="w-5 h-5" />
            </motion.div>
            Exporting...
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            Export {format.toUpperCase()} File
          </>
        )}
      </button>

      {/* Success Message */}
      {!isExporting && (
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-3">
          Click to download analytics data
        </p>
      )}
    </div>
  );
}

function DataTypeCard({
  icon,
  title,
  description,
  selected,
  onClick
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-lg border-2 transition-all text-left ${
        selected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
      }`}
    >
      <div className="flex items-center gap-3 mb-2">
        <div
          className={`p-2 rounded-lg ${
            selected
              ? 'bg-blue-500 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          {icon}
        </div>
        {selected && <CheckCircle className="w-5 h-5 text-blue-500 ml-auto" />}
      </div>
      <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
        {title}
      </h4>
      <p className="text-xs text-slate-600 dark:text-slate-400">
        {description}
      </p>
    </button>
  );
}

function FormatButton({
  icon,
  label,
  description,
  selected,
  onClick
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 p-4 rounded-lg border-2 transition-all ${
        selected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <div
          className={`p-1.5 rounded ${
            selected
              ? 'bg-blue-500 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          {icon}
        </div>
        <span className="font-semibold text-slate-900 dark:text-white">
          {label}
        </span>
        {selected && <CheckCircle className="w-4 h-4 text-blue-500 ml-auto" />}
      </div>
      <p className="text-xs text-slate-600 dark:text-slate-400">
        {description}
      </p>
    </button>
  );
}
