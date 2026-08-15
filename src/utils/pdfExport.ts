import html2canvas from 'html2canvas';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { sanitizeDomColorsForCanvas, replaceOklchInString } from './colorUtils';

export interface ExportResult {
  success: boolean;
  message?: string;
}

/**
 * Ensures all web fonts are loaded before DOM capture
 */
async function waitForFontsLoaded(): Promise<void> {
  try {
    if ('fonts' in document) {
      await document.fonts.ready;
    }
  } catch {
    // Proceed if document.fonts API is not supported
  }
}

/**
 * Capture DOM element to Canvas using html-to-image with html2canvas fallback
 */
async function captureElementToCanvas(element: HTMLElement): Promise<HTMLCanvasElement> {
  await waitForFontsLoaded();

  let targetEl = element;
  let offscreenContainer: HTMLElement | null = null;

  // If the target element is hidden (e.g. on mobile tab or display:none) or has 0 dimensions, clone to offscreen A4 container
  const rect = element.getBoundingClientRect();
  const isHidden = rect.width === 0 || rect.height === 0 || window.getComputedStyle(element).display === 'none';

  if (isHidden) {
    offscreenContainer = document.createElement('div');
    offscreenContainer.style.position = 'fixed';
    offscreenContainer.style.left = '-9999px';
    offscreenContainer.style.top = '0';
    offscreenContainer.style.width = '794px';
    offscreenContainer.style.minHeight = '1122px';
    offscreenContainer.style.zIndex = '-9999';
    offscreenContainer.style.backgroundColor = '#ffffff';
    offscreenContainer.style.display = 'block';
    offscreenContainer.style.visibility = 'visible';
    offscreenContainer.style.opacity = '1';

    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.display = 'block';
    clone.style.visibility = 'visible';
    clone.style.width = '794px';
    clone.style.transform = 'none';
    clone.style.opacity = '1';
    offscreenContainer.appendChild(clone);
    document.body.appendChild(offscreenContainer);
    targetEl = clone;

    // Small delay to let fonts/DOM paint
    await new Promise((r) => setTimeout(r, 50));
  }

  // Sanitize any modern oklch CSS colors in DOM before rendering
  const restoreColors = sanitizeDomColorsForCanvas(targetEl);

  try {
    // Attempt 1: html-to-image with skipFonts: true and style override
    try {
      const dataUrl = await toPng(targetEl, {
        quality: 0.98,
        pixelRatio: 2,
        cacheBust: true,
        skipFonts: true,
        backgroundColor: '#ffffff',
        width: targetEl.offsetWidth || 794,
        height: targetEl.offsetHeight || 1122,
        style: {
          transform: 'none',
          transformOrigin: 'top left'
        },
        filter: (node) => {
          if (node instanceof HTMLElement && node.classList.contains('print:hidden')) {
            return false;
          }
          return true;
        }
      });

      if (dataUrl && dataUrl.length > 200) {
        const img = new Image();
        img.src = dataUrl;
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        if (img.width > 0 && img.height > 0) {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);

            // Verify that image is not blank (check pixel non-whiteness sample)
            const sampleData = ctx.getImageData(0, 0, Math.min(200, canvas.width), Math.min(200, canvas.height)).data;
            let isBlank = true;
            for (let i = 0; i < sampleData.length; i += 4) {
              if (sampleData[i + 3] > 0 && (sampleData[i] < 250 || sampleData[i + 1] < 250 || sampleData[i + 2] < 250)) {
                isBlank = false;
                break;
              }
            }

            if (!isBlank) {
              restoreColors();
              if (offscreenContainer && document.body.contains(offscreenContainer)) {
                document.body.removeChild(offscreenContainer);
              }
              return canvas;
            }
          }
        }
      }
    } catch (err) {
      console.warn('html-to-image failed or produced empty canvas, falling back to html2canvas:', err);
    }

    // Attempt 2: html2canvas fallback with CORS & clone sanitization
    const canvas = await html2canvas(targetEl, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: targetEl.offsetWidth || 794,
      height: targetEl.offsetHeight || 1122,
      ignoreElements: (el) => el.classList.contains('print:hidden'),
      onclone: (clonedDoc, clonedEl) => {
        // Sanitize oklch/oklab from all <style> elements in cloned document
        if (clonedDoc) {
          const styleElements = clonedDoc.querySelectorAll('style');
          styleElements.forEach((styleTag) => {
            if (styleTag.textContent && /oklch|oklab|lab|lch|color\(/i.test(styleTag.textContent)) {
              styleTag.textContent = replaceOklchInString(styleTag.textContent);
            }
          });

          // Sanitize CSS rules in document stylesheets
          try {
            Array.from(clonedDoc.styleSheets).forEach((sheet) => {
              try {
                const rules = sheet.cssRules || (sheet as any).rules;
                if (rules) {
                  Array.from(rules).forEach((rule: any) => {
                    if (rule.style && rule.cssText && /oklch|oklab|lab|lch|color\(/i.test(rule.cssText)) {
                      for (let i = 0; i < rule.style.length; i++) {
                        const prop = rule.style[i];
                        const val = rule.style.getPropertyValue(prop);
                        if (val && /oklch|oklab|lab|lch|color\(/i.test(val)) {
                          rule.style.setProperty(prop, replaceOklchInString(val));
                        }
                      }
                    }
                  });
                }
              } catch {
                // Ignore cross-origin stylesheet restrictions
              }
            });
          } catch {
            // Ignore
          }
        }

        if (clonedEl instanceof HTMLElement) {
          clonedEl.style.transform = 'none';
          clonedEl.style.transformOrigin = 'top left';
          clonedEl.style.margin = '0';
          clonedEl.style.position = 'relative';
          clonedEl.style.opacity = '1';
          clonedEl.style.visibility = 'visible';
          sanitizeDomColorsForCanvas(clonedEl);
        }
      }
    });
    restoreColors();
    if (offscreenContainer && document.body.contains(offscreenContainer)) {
      document.body.removeChild(offscreenContainer);
    }
    return canvas;
  } catch (err) {
    restoreColors();
    if (offscreenContainer && document.body.contains(offscreenContainer)) {
      document.body.removeChild(offscreenContainer);
    }
    throw err;
  }
}

/**
 * Export CV as PNG or JPEG image
 */
export async function exportCVToImage(
  elementId: string,
  filename: string,
  format: 'png' | 'jpeg' = 'png'
): Promise<ExportResult> {
  const element = document.getElementById(elementId);
  if (!element) {
    return { success: false, message: `Élément avec l'ID ${elementId} introuvable.` };
  }

  try {
    const canvas = await captureElementToCanvas(element);
    if (!canvas || !canvas.width || !canvas.height || canvas.width <= 0 || canvas.height <= 0 || isNaN(canvas.width) || isNaN(canvas.height)) {
      return { success: false, message: "Impossible de capturer les dimensions du CV pour l'image." };
    }

    const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
    const extension = format === 'jpeg' ? 'jpg' : 'png';
    const imgData = canvas.toDataURL(mimeType, format === 'jpeg' ? 0.95 : 1.0);

    const cleanFilename = filename.replace(/[^a-zA-Z0-9_-]/g, '_') || 'CV_Professionnel';

    const link = document.createElement('a');
    link.href = imgData;
    link.download = `${cleanFilename}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return { success: true, message: `Image ${format.toUpperCase()} exportée avec succès !` };
  } catch (error: any) {
    console.error(`Error generating ${format.toUpperCase()} image:`, error);
    return {
      success: false,
      message: `Erreur lors de la génération de l'image : ${error?.message || 'Problème de rendu'}`
    };
  }
}

/**
 * Export CV as high-definition PDF with selectable text layer for ATS compatibility
 */
export async function exportCVToPDF(
  elementId: string,
  filename: string,
  isTwoPagesMode: boolean = false
): Promise<ExportResult> {
  const element = document.getElementById(elementId);
  if (!element) {
    return { success: false, message: `Élément avec l'ID ${elementId} introuvable.` };
  }

  try {
    const canvas = await captureElementToCanvas(element);

    if (!canvas || !canvas.width || !canvas.height || canvas.width <= 0 || canvas.height <= 0 || isNaN(canvas.width) || isNaN(canvas.height)) {
      return { success: false, message: "Impossible de mesurer les dimensions du CV pour l'exportation PDF." };
    }

    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    // Standard A4 portrait dimensions in mm (210 x 297)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth() || 210; // 210mm
    const pdfHeight = pdf.internal.pageSize.getHeight() || 297; // 297mm

    const safePdfWidth = (typeof pdfWidth === 'number' && isFinite(pdfWidth) && pdfWidth > 0) ? pdfWidth : 210;
    const safePdfHeight = (typeof pdfHeight === 'number' && isFinite(pdfHeight) && pdfHeight > 0) ? pdfHeight : 297;

    const imgWidth = safePdfWidth;
    let rawImgHeight = (canvas.height * safePdfWidth) / canvas.width;

    if (!rawImgHeight || isNaN(rawImgHeight) || !isFinite(rawImgHeight) || rawImgHeight <= 0) {
      rawImgHeight = safePdfHeight;
    }

    if (!isTwoPagesMode) {
      // STRICT 1-PAGE MODE: Guarantee single page A4 output exactly 210x297mm without spilling onto page 2
      pdf.addImage(imgData, 'JPEG', 0, 0, safePdfWidth, safePdfHeight, undefined, 'FAST');
    } else {
      // 2-PAGE MODE: Split cleanly across 2 pages
      const page1Height = safePdfHeight;
      pdf.addImage(imgData, 'JPEG', 0, 0, safePdfWidth, rawImgHeight, undefined, 'FAST');
      
      let heightLeft = rawImgHeight - page1Height;
      let position = -page1Height;
      let maxPages = 4;

      while (heightLeft > 20 && maxPages > 0) {
        maxPages--;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, safePdfWidth, rawImgHeight, undefined, 'FAST');
        position -= safePdfHeight;
        heightLeft -= safePdfHeight;
      }
    }

    // Extract text nodes from DOM to add an invisible/transparent selectable text layer for ATS engines
    try {
      const textNodes: string[] = [];
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => {
          if (!node.textContent || node.textContent.trim().length === 0) return NodeFilter.FILTER_REJECT;
          const parent = node.parentElement;
          if (parent && parent.classList?.contains('print:hidden')) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      });

      while (walker.nextNode()) {
        const text = walker.currentNode.textContent?.trim();
        if (text && text.length > 0) textNodes.push(text);
      }

      // Append text content as transparent/selectable layer at top coordinates without triggering page break
      if (textNodes.length > 0) {
        pdf.setTextColor(255, 255, 255); // White or hidden
        pdf.setFontSize(0.5); // Micro size text overlay for ATS indexers
        const fullText = textNodes.join(' ').replace(/[\r\n\t]+/g, ' ');
        // Set at page top with small footprint to avoid auto page break
        pdf.text(fullText.slice(0, 2000), 5, 5, { maxWidth: safePdfWidth - 10 });
      }
    } catch {
      // Non-critical text overlay failure fallback
    }

    // Strict page count enforcement: if 1-page mode was requested, eliminate any accidental extra pages
    if (!isTwoPagesMode) {
      while (pdf.getNumberOfPages() > 1) {
        pdf.deletePage(pdf.getNumberOfPages());
      }
    }

    const cleanFilename = filename.replace(/[^a-zA-Z0-9_-]/g, '_') || 'CV_Professionnel';
    pdf.save(`${cleanFilename}.pdf`);

    return { success: true, message: 'CV PDF HD exporté avec succès (1 page garantie) !' };
  } catch (error: any) {
    console.error('Error generating PDF:', error);
    return {
      success: false,
      message: `Erreur lors de l'exportation PDF : ${error?.message || 'Erreur inconnue'}`
    };
  }
}
