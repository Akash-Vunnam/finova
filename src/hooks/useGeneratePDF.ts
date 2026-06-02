"use client";

import { useState } from "react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export function useGeneratePDF(elementId: string, filename: string) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    const element = document.getElementById(elementId);
    if (!element) {
      toast.error("Could not find content to generate PDF");
      return;
    }

    try {
      setIsGenerating(true);
      toast.loading("Generating PDF...", { id: "pdf-toast" });

      // Add a specific class or style temporarily if needed for better print output
      // For instance, forcing a white background or adjusting sizes
      const originalBg = element.style.background;
      element.style.background = "#0a0f1c"; // Match the dark theme background for consistency
      
      const canvas = await html2canvas(element, {
        scale: 2, // Higher resolution
        useCORS: true,
        logging: false,
        backgroundColor: "#0a0f1c", // Ensure dark theme background
        windowWidth: 1200, // Fixed width for consistent layout
      });

      element.style.background = originalBg;

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      
      // Calculate dimensions to fit A4 page while maintaining aspect ratio
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      const canvasWidthInMm = imgWidth * 0.264583;
      const canvasHeightInMm = imgHeight * 0.264583;

      let heightLeft = canvasHeightInMm;
      let position = 0;
      
      // Calculate how many pages we need based on the image height
      const pageHeightInMm = pdfHeight;
      const widthInMm = pdfWidth;
      
      // First page
      pdf.addImage(imgData, 'JPEG', 0, position, widthInMm, canvasHeightInMm * (widthInMm / canvasWidthInMm));
      heightLeft -= pageHeightInMm * (canvasWidthInMm / widthInMm);

      // Add subsequent pages if the content overflows
      while (heightLeft >= 0) {
        position = heightLeft - canvasHeightInMm;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position * (widthInMm / canvasWidthInMm), widthInMm, canvasHeightInMm * (widthInMm / canvasWidthInMm));
        heightLeft -= pageHeightInMm * (canvasWidthInMm / widthInMm);
      }

      pdf.save(filename);
      
      toast.success("PDF downloaded successfully", { id: "pdf-toast" });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.", { id: "pdf-toast" });
    } finally {
      setIsGenerating(false);
    }
  };

  return { generatePDF, isGenerating };
}
