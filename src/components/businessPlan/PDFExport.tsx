import React from 'react';
import { Download, FileText } from 'lucide-react';

interface PDFExportProps {
  sections: Array<{
    id: string;
    title: string;
    content: string;
  }>;
  companyName: string;
  onExport?: () => void;
}

const PDFExport: React.FC<PDFExportProps> = ({ sections, companyName, onExport }) => {
  const handlePDFExport = async () => {
    try {
      // Importer dynamiquement html2pdf pour éviter les problèmes SSR
      const html2pdf = (await import('html2pdf.js')).default;
      
      const element = document.createElement('div');
      element.innerHTML = generateBusinessPlanHTML();
      
      const opt = {
        margin: [20, 15, 20, 15],
        filename: `${companyName.replace(/\s+/g, '-')}-Plan-Affaires.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true 
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        },
        pagebreak: { 
          mode: ['avoid-all', 'css', 'legacy'],
          before: '.page-break-before',
          after: '.page-break-after'
        }
      };

      await html2pdf().set(opt).from(element).save();
      onExport?.();
    } catch (error) {
      console.error('Erreur d\'exportation PDF:', error);
      // Solution de secours vers l'exportation HTML
      handleHTMLExport();
    }
  };

  const handleHTMLExport = () => {
    const htmlContent = generateBusinessPlanHTML();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${companyName.replace(/\s+/g, '-')}-Plan-Affaires.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onExport?.();
  };

  const generateBusinessPlanHTML = () => {
    return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Plan d'affaires ${companyName}</title>
        <style>
          @page {
            margin: 20mm 15mm;
            size: A4;
          }
          
          body {
            font-family: 'Times New Roman', serif;
            line-height: 1.6;
            color: #333;
            max-width: 210mm;
            margin: 0 auto;
            padding: 0;
            background: white;
          }
          
          .cover-page {
            text-align: center;
            padding: 100px 0;
            page-break-after: always;
            min-height: 80vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          
          .cover-title {
            font-size: 48px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 30px;
            text-transform: uppercase;
          }
          
          .cover-subtitle {
            font-size: 24px;
            color: #666;
            margin-bottom: 50px;
          }
          
          .cover-date {
            font-size: 18px;
            color: #888;
          }
          
          .section {
            margin-bottom: 40px;
            page-break-inside: avoid;
          }
          
          .section-title {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #2563eb;
            page-break-after: avoid;
          }
          
          .section-content {
            font-size: 14px;
            text-align: justify;
          }
          
          .section-content p {
            margin-bottom: 15px;
          }
          
          .section-content h1,
          .section-content h2,
          .section-content h3 {
            color: #1e40af;
            margin-top: 25px;
            margin-bottom: 15px;
            page-break-after: avoid;
          }
          
          .section-content ul,
          .section-content ol {
            margin-bottom: 15px;
            padding-left: 25px;
          }
          
          .section-content li {
            margin-bottom: 8px;
          }
          
          .section-content blockquote {
            border-left: 4px solid #2563eb;
            margin: 20px 0;
            padding-left: 20px;
            font-style: italic;
            color: #555;
          }
          
          .table-of-contents {
            page-break-after: always;
            margin-bottom: 40px;
          }
          
          .toc-title {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 30px;
            text-align: center;
          }
          
          .toc-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 5px 0;
            border-bottom: 1px dotted #ccc;
          }
          
          .toc-section {
            font-weight: bold;
          }
          
          .page-break-before {
            page-break-before: always;
          }
          
          .page-break-after {
            page-break-after: always;
          }
          
          .footer {
            position: fixed;
            bottom: 15mm;
            width: 100%;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          
          @media print {
            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <!-- Page de couverture -->
        <div class="cover-page">
          <div class="cover-title">${companyName}</div>
          <div class="cover-subtitle">Plan d'affaires</div>
          <div class="cover-date">${new Date().toLocaleDateString('fr-FR', { 
            month: 'long', 
            year: 'numeric' 
          })}</div>
        </div>
        
        <!-- Table des matières -->
        <div class="table-of-contents">
          <div class="toc-title">Table des matières</div>
          ${sections.filter(s => s.content && s.id !== 'cover').map((section, index) => `
            <div class="toc-item">
              <span class="toc-section">${section.title}</span>
              <span>${index + 3}</span>
            </div>
          `).join('')}
        </div>
        
        <!-- Sections du plan d'affaires -->
        ${sections
          .filter(section => section.content && section.id !== 'cover')
          .map((section, index) => `
            <div class="section ${index > 0 ? 'page-break-before' : ''}">
              <h1 class="section-title">${section.title}</h1>
              <div class="section-content">
                ${section.content}
              </div>
            </div>
          `).join('')}
        
        <div class="footer">
          Plan d'affaires ${companyName} - Document confidentiel
        </div>
      </body>
      </html>
    `;
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handlePDFExport}
        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        <FileText className="w-4 h-4" />
        Exporter PDF
      </button>
      
      <button
        onClick={handleHTMLExport}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Download className="w-4 h-4" />
        Exporter HTML
      </button>
    </div>
  );
};

export default PDFExport; 