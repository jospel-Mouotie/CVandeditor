import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType
} from 'docx';
import type { CV, Section, ExperienceItem, FormationItem, CompetenceItem, LangueItem } from '../types.js';

/**
 * Generates and downloads a clean, professional Microsoft Word (.docx) document
 * preserving exact semantic structure (headings, dates, organizations, bullet points, skills).
 */
export async function exportCVToDocx(cv: CV): Promise<boolean> {
  try {
    const profilSection = cv.sections.find((s) => s.type === 'profil');
    const profilContenu = profilSection?.contenu || {};

    const nomComplet = profilContenu.nomComplet || 'Mon Nom';
    const titrePro = profilContenu.titreProfessionnel || '';
    const email = profilContenu.email || '';
    const telephone = profilContenu.telephone || '';
    const adresse = profilContenu.adresse || '';
    const resume = profilContenu.resume || '';
    const linkedin = profilContenu.linkedin || '';
    const siteWeb = profilContenu.siteWeb || '';

    const accentHex = (cv.couleurAccent || '#2563EB').replace('#', '');

    const docChildren: (Paragraph | Table)[] = [];

    // Header: Full Name
    docChildren.push(
      new Paragraph({
        text: nomComplet,
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 }
      })
    );

    // Headline
    if (titrePro) {
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: titrePro,
              bold: true,
              size: 26,
              color: accentHex
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 }
        })
      );
    }

    // Contact line
    const contacts: string[] = [];
    if (email) contacts.push(email);
    if (telephone) contacts.push(telephone);
    if (adresse) contacts.push(adresse);
    if (linkedin) contacts.push(linkedin);
    if (siteWeb) contacts.push(siteWeb);

    if (contacts.length > 0) {
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: contacts.join('  •  '),
              size: 19,
              color: '555555'
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 240 }
        })
      );
    }

    // Professional Summary
    if (resume) {
      docChildren.push(
        new Paragraph({
          text: 'PROFIL PROFESSIONNEL',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
          border: {
            bottom: {
              color: accentHex,
              space: 4,
              style: BorderStyle.SINGLE,
              size: 12
            }
          }
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: resume,
              size: 21
            })
          ],
          spacing: { after: 240 }
        })
      );
    }

    // Sort remaining visible sections
    const remainingSections = cv.sections
      .filter((s) => s.visible && s.type !== 'profil')
      .sort((a, b) => a.ordre - b.ordre);

    for (const section of remainingSections) {
      const secTitle = (section.titre || section.type).toUpperCase();

      docChildren.push(
        new Paragraph({
          text: secTitle,
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 240, after: 120 },
          border: {
            bottom: {
              color: accentHex,
              space: 4,
              style: BorderStyle.SINGLE,
              size: 12
            }
          }
        })
      );

      if (section.type === 'experience' && Array.isArray(section.contenu)) {
        const exps = section.contenu as ExperienceItem[];
        for (const exp of exps) {
          const dateStr = `${exp.dateDebut || ''} - ${exp.actuel ? 'Présent' : exp.dateFin || ''}`.trim();
          docChildren.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: exp.poste || 'Poste',
                  bold: true,
                  size: 22,
                  color: '1E293B'
                }),
                new TextRun({
                  text: exp.entreprise ? `  |  ${exp.entreprise}` : '',
                  italics: true,
                  size: 21,
                  color: '475569'
                }),
                new TextRun({
                  text: dateStr ? `  (${dateStr})` : '',
                  size: 19,
                  color: '64748B'
                })
              ],
              spacing: { before: 120, after: 60 }
            })
          );

          if (exp.description) {
            docChildren.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: exp.description,
                    size: 20
                  })
                ],
                spacing: { after: 60 }
              })
            );
          }

          const expTaches = (exp as any).taches;
          if (Array.isArray(expTaches) && expTaches.length > 0) {
            for (const tache of expTaches) {
              docChildren.push(
                new Paragraph({
                  children: [new TextRun({ text: tache, size: 20 })],
                  bullet: { level: 0 },
                  spacing: { after: 40 }
                })
              );
            }
          }
        }
      } else if (section.type === 'formation' && Array.isArray(section.contenu)) {
        const forms = section.contenu as FormationItem[];
        for (const form of forms) {
          const dateStr = `${form.dateDebut || ''} - ${form.dateFin || ''}`.trim();
          docChildren.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: form.diplome || 'Diplôme',
                  bold: true,
                  size: 22,
                  color: '1E293B'
                }),
                new TextRun({
                  text: form.etablissement ? `  |  ${form.etablissement}` : '',
                  italics: true,
                  size: 21,
                  color: '475569'
                }),
                new TextRun({
                  text: dateStr ? `  (${dateStr})` : '',
                  size: 19,
                  color: '64748B'
                })
              ],
              spacing: { before: 120, after: 60 }
            })
          );

          if (form.description) {
            docChildren.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: form.description,
                    size: 20
                  })
                ],
                spacing: { after: 80 }
              })
            );
          }
        }
      } else if (section.type === 'competences' && Array.isArray(section.contenu)) {
        const comps = section.contenu as CompetenceItem[];
        const compNames = comps.map((c) => c.nom).filter(Boolean);

        docChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: compNames.join('   •   '),
                size: 21,
                bold: false
              })
            ],
            spacing: { after: 120 }
          })
        );
      } else if (section.type === 'langues' && Array.isArray(section.contenu)) {
        const langs = section.contenu as LangueItem[];
        const langStrings = langs.map((l) => `${l.langue}${l.niveau ? ` (${l.niveau})` : ''}`).filter(Boolean);

        docChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: langStrings.join('   •   '),
                size: 21
              })
            ],
            spacing: { after: 120 }
          })
        );
      } else if (Array.isArray(section.contenu)) {
        // Generic list or text items
        for (const item of section.contenu) {
          const itemText = typeof item === 'string' ? item : item.nom || item.titre || item.description || '';
          if (itemText) {
            docChildren.push(
              new Paragraph({
                children: [new TextRun({ text: itemText, size: 20 })],
                bullet: { level: 0 },
                spacing: { after: 40 }
              })
            );
          }
        }
      }
    }

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 720,
                bottom: 720,
                left: 900,
                right: 900
              }
            }
          },
          children: docChildren
        }
      ]
    });

    const blob = await Packer.toBlob(doc);
    const fileName = `${(nomComplet || 'CV').replace(/\s+/g, '_')}_CV.docx`;

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('Error generating DOCX:', error);
    return false;
  }
}
