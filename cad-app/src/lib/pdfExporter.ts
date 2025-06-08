import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface ExportOptions {
  format: 'A4' | 'A3' | 'Letter' | 'Legal';
  orientation: 'portrait' | 'landscape';
  quality: number; // 0.1 to 1.0
  includeBackground: boolean;
  scale: number;
  title?: string;
  author?: string;
}

export class PDFExporter {
  private static getPageDimensions(format: string, orientation: string) {
    const dimensions = {
      A4: { width: 210, height: 297 },
      A3: { width: 297, height: 420 },
      Letter: { width: 216, height: 279 },
      Legal: { width: 216, height: 356 },
    };

    const dim = dimensions[format as keyof typeof dimensions] || dimensions.A4;
    
    return orientation === 'landscape' 
      ? { width: dim.height, height: dim.width }
      : dim;
  }

  static async exportToPDF(
    elementId: string,
    filename: string = 'cad-drawing.pdf',
    options: Partial<ExportOptions> = {}
  ): Promise<void> {
    const defaultOptions: ExportOptions = {
      format: 'A4',
      orientation: 'landscape',
      quality: 0.95,
      includeBackground: true,
      scale: 2,
      title: 'CAD Drawing',
      author: 'CAD Application',
      ...options,
    };

    try {
      // Get the element to export
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`Element with ID '${elementId}' not found`);
      }

      // Create canvas from the element
      const canvas = await html2canvas(element, {
        scale: defaultOptions.scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: defaultOptions.includeBackground ? '#ffffff' : null,
        removeContainer: false,
        logging: false,
      });

      // Get page dimensions
      const pageDim = this.getPageDimensions(
        defaultOptions.format,
        defaultOptions.orientation
      );

      // Create PDF
      const pdf = new jsPDF({
        orientation: defaultOptions.orientation,
        unit: 'mm',
        format: defaultOptions.format,
      });

      // Set document metadata
      if (defaultOptions.title) {
        pdf.setProperties({
          title: defaultOptions.title,
          author: defaultOptions.author || '',
          subject: 'CAD Drawing Export',
          creator: 'CAD Application',
        });
      }

      // Calculate dimensions to fit the image on the page
      const imgWidth = pageDim.width - 20; // 10mm margin on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let finalHeight = imgHeight;
      let finalWidth = imgWidth;

      // If image is too tall, scale it down
      if (imgHeight > pageDim.height - 20) {
        finalHeight = pageDim.height - 20;
        finalWidth = (canvas.width * finalHeight) / canvas.height;
      }

      // Center the image on the page
      const x = (pageDim.width - finalWidth) / 2;
      const y = (pageDim.height - finalHeight) / 2;

      // Add image to PDF
      const imgData = canvas.toDataURL('image/jpeg', defaultOptions.quality);
      pdf.addImage(imgData, 'JPEG', x, y, finalWidth, finalHeight);

      // Add timestamp footer
      const timestamp = new Date().toLocaleString();
      pdf.setFontSize(8);
      pdf.setTextColor(128);
      pdf.text(`Exported on ${timestamp}`, 10, pageDim.height - 5);

      // Save the PDF
      pdf.save(filename);
      
      console.log(`PDF exported successfully as ${filename}`);
    } catch (error) {
      console.error('Failed to export PDF:', error);
      throw error;
    }
  }

  static async exportMultiPagePDF(
    elementIds: string[],
    filename: string = 'cad-drawings.pdf',
    options: Partial<ExportOptions> = {}
  ): Promise<void> {
    const defaultOptions: ExportOptions = {
      format: 'A4',
      orientation: 'landscape',
      quality: 0.95,
      includeBackground: true,
      scale: 2,
      title: 'CAD Drawings',
      author: 'CAD Application',
      ...options,
    };

    try {
      const pageDim = this.getPageDimensions(
        defaultOptions.format,
        defaultOptions.orientation
      );

      const pdf = new jsPDF({
        orientation: defaultOptions.orientation,
        unit: 'mm',
        format: defaultOptions.format,
      });

      // Set document metadata
      if (defaultOptions.title) {
        pdf.setProperties({
          title: defaultOptions.title,
          author: defaultOptions.author || '',
          subject: 'CAD Drawings Export',
          creator: 'CAD Application',
        });
      }

      for (let i = 0; i < elementIds.length; i++) {
        const elementId = elementIds[i];
        const element = document.getElementById(elementId);
        
        if (!element) {
          console.warn(`Element with ID '${elementId}' not found, skipping...`);
          continue;
        }

        // Add new page if not the first element
        if (i > 0) {
          pdf.addPage();
        }

        // Create canvas from the element
        const canvas = await html2canvas(element, {
          scale: defaultOptions.scale,
          useCORS: true,
          allowTaint: true,
          backgroundColor: defaultOptions.includeBackground ? '#ffffff' : null,
          removeContainer: false,
          logging: false,
        });

        // Calculate dimensions
        const imgWidth = pageDim.width - 20;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        let finalHeight = imgHeight;
        let finalWidth = imgWidth;

        if (imgHeight > pageDim.height - 20) {
          finalHeight = pageDim.height - 20;
          finalWidth = (canvas.width * finalHeight) / canvas.height;
        }

        const x = (pageDim.width - finalWidth) / 2;
        const y = (pageDim.height - finalHeight) / 2;

        // Add image to PDF
        const imgData = canvas.toDataURL('image/jpeg', defaultOptions.quality);
        pdf.addImage(imgData, 'JPEG', x, y, finalWidth, finalHeight);

        // Add page number
        pdf.setFontSize(8);
        pdf.setTextColor(128);
        pdf.text(`Page ${i + 1} of ${elementIds.length}`, pageDim.width - 30, pageDim.height - 5);
      }

      // Add timestamp footer on last page
      const timestamp = new Date().toLocaleString();
      pdf.text(`Exported on ${timestamp}`, 10, pageDim.height - 5);

      // Save the PDF
      pdf.save(filename);
      
      console.log(`Multi-page PDF exported successfully as ${filename}`);
    } catch (error) {
      console.error('Failed to export multi-page PDF:', error);
      throw error;
    }
  }
}
