export type DocType = "pdf" | "docx" | "folder";

export interface SheetDoc {
  key: string;
  title: string;
  type: DocType;
  driveId: string;
  embedUrl: string;
  downloadUrl: string;
}

const drivePreview = (id: string) =>
  `https://drive.google.com/file/d/${id}/preview`;

const driveDownload = (id: string) =>
  `https://drive.google.com/uc?export=download&id=${id}`;

const driveFolder = (id: string) =>
  `https://drive.google.com/drive/folders/${id}?usp=sharing`;

const gdocDownloadDocx = (id: string) =>
  `https://docs.google.com/document/d/${id}/export?format=docx`;

export const fondosDocs: SheetDoc[] = [
  {
    key: "bases-fondos-participativos",
    title: "Bases Fondos Participativos",
    type: "pdf",
    driveId: "1s-2dHNGURJ71662es_DnjPZlcm3oVLMx",
    embedUrl: drivePreview("1s-2dHNGURJ71662es_DnjPZlcm3oVLMx"),
    downloadUrl: driveDownload("1s-2dHNGURJ71662es_DnjPZlcm3oVLMx"),
  },
  {
    key: "form-fondos-descentralizados-2025",
    title: "Formulario Fondos Descentralizados 2025",
    type: "docx",
    driveId: "1cACcKd2cjQZb502g3EUYVY3_eB9k86qa",
    embedUrl: drivePreview("1cACcKd2cjQZb502g3EUYVY3_eB9k86qa"),
    downloadUrl: gdocDownloadDocx("1cACcKd2cjQZb502g3EUYVY3_eB9k86qa"),
  },
  {
    key: "form-fondos-participativos-2025",
    title: "Formulario Fondos Participativos 2025",
    type: "docx",
    driveId: "15XRQbVBSJ1Gpctzlq2IPUEIdthJx9icH",
    embedUrl: drivePreview("15XRQbVBSJ1Gpctzlq2IPUEIdthJx9icH"),
    downloadUrl: gdocDownloadDocx("15XRQbVBSJ1Gpctzlq2IPUEIdthJx9icH"),
  },
];

export const documentosDocs: SheetDoc[] = [
  {
    key: "estatutos-generales-2024",
    title: "Estatutos Generales 2024",
    type: "pdf",
    driveId: "19XnJXUM4ycHEmAk2wacWscC2QEB92AcF",
    embedUrl: drivePreview("19XnJXUM4ycHEmAk2wacWscC2QEB92AcF"),
    downloadUrl: driveDownload("19XnJXUM4ycHEmAk2wacWscC2QEB92AcF"),
  },
  {
    key: "estatutos-cegesex-2024",
    title: "ESTATUTOS CEGESEX 2024",
    type: "pdf",
    driveId: "1jQi76rcMEw4QkqZBmWVZ6QlDDXOXbBNT",
    embedUrl: drivePreview("1jQi76rcMEw4QkqZBmWVZ6QlDDXOXbBNT"),
    downloadUrl: driveDownload("1jQi76rcMEw4QkqZBmWVZ6QlDDXOXbBNT"),
  },
  {
    key: "manual-sanciones-academicas",
    title: "MANUAL DE SANCIONES ACADÉMICAS",
    type: "pdf",
    driveId: "17s3DfRRBEE1M8s_kIA6Z-2nkQF050cw4",
    embedUrl: drivePreview("17s3DfRRBEE1M8s_kIA6Z-2nkQF050cw4"),
    downloadUrl: driveDownload("17s3DfRRBEE1M8s_kIA6Z-2nkQF050cw4"),
  },
  {
    key: "guia-ingreso-solicitudes-liberacion-sanciones",
    title: "Guía Ingreso Solicitudes Liberación Sanciones",
    type: "pdf",
    driveId: "1NkAu-B5xoVChU4ZEH-j2lVezQbmEjCiq",
    embedUrl: drivePreview("1NkAu-B5xoVChU4ZEH-j2lVezQbmEjCiq"),
    downloadUrl: driveDownload("1NkAu-B5xoVChU4ZEH-j2lVezQbmEjCiq"),
  },
  {
    key: "reglamento-consejeros-estudiantiles-fepucv",
    title: "Reglamento Consejeros Estudiantiles FEPUCV",
    type: "pdf",
    driveId: "1-dXxSQoR-9GSgMnX2MCXoNjbWtWvaXHp",
    embedUrl: drivePreview("1-dXxSQoR-9GSgMnX2MCXoNjbWtWvaXHp"),
    downloadUrl: driveDownload("1-dXxSQoR-9GSgMnX2MCXoNjbWtWvaXHp"),
  },
  {
    key: "reglamento-convencion-estudiantes",
    title: "Reglamento Convención de Estudiantes",
    type: "pdf",
    driveId: "1vWiKi_FMi2quYir1uEiOE8VXxmlssvmQ",
    embedUrl: drivePreview("1vWiKi_FMi2quYir1uEiOE8VXxmlssvmQ"),
    downloadUrl: driveDownload("1vWiKi_FMi2quYir1uEiOE8VXxmlssvmQ"),
  },
  {
    key: "reglamento-elecciones",
    title: "Reglamento de Elecciones",
    type: "pdf",
    driveId: "1hmZW-sL3hhhgDEDDe0_mIkdZKCYGyFW2",
    embedUrl: drivePreview("1hmZW-sL3hhhgDEDDe0_mIkdZKCYGyFW2"),
    downloadUrl: driveDownload("1hmZW-sL3hhhgDEDDe0_mIkdZKCYGyFW2"),
  },
  {
    key: "reglamento-sala-cge",
    title: "Reglamento de Sala CGE",
    type: "pdf",
    driveId: "1bynIZMeWOd-gZot-rdjrKUgqjQutzjYw",
    embedUrl: drivePreview("1bynIZMeWOd-gZot-rdjrKUgqjQutzjYw"),
    downloadUrl: driveDownload("1bynIZMeWOd-gZot-rdjrKUgqjQutzjYw"),
  },
  {
    key: "reglamento-estudiantil-cahvda-2024",
    title: "Reglamento Estudiantil CAHVDA 2024",
    type: "pdf",
    driveId: "18U4_jtH-qwNxxePXj2K7sX7xWTmT5HYb",
    embedUrl: drivePreview("18U4_jtH-qwNxxePXj2K7sX7xWTmT5HYb"),
    downloadUrl: driveDownload("18U4_jtH-qwNxxePXj2K7sX7xWTmT5HYb"),
  },
  {
    key: "reglamento-cees-bases",
    title: "Reglamento para Cees y Bases",
    type: "pdf",
    driveId: "1g5HUgDfI6Eiq1B3Ty4ypzFCBOFuqS8Ew",
    embedUrl: drivePreview("1g5HUgDfI6Eiq1B3Ty4ypzFCBOFuqS8Ew"),
    downloadUrl: driveDownload("1g5HUgDfI6Eiq1B3Ty4ypzFCBOFuqS8Ew"),
  },
];

export const transparenciaDocs: SheetDoc[] = [
  {
    key: "actas-plenarias",
    title: "Actas Plenarias",
    type: "folder",
    driveId: "1HmpGl5nrhtSI2MmONbNOK6G4upzCKdCx",
    embedUrl: driveFolder("1HmpGl5nrhtSI2MmONbNOK6G4upzCKdCx"),
    downloadUrl: driveFolder("1HmpGl5nrhtSI2MmONbNOK6G4upzCKdCx"),
  },
  {
    key: "rendiciones-financieras",
    title: "Rendiciones Financieras",
    type: "folder",
    driveId: "19DSc1-Cy8oOdLVWWgGaL-1MPorEEqnVv",
    embedUrl: driveFolder("19DSc1-Cy8oOdLVWWgGaL-1MPorEEqnVv"),
    downloadUrl: driveFolder("19DSc1-Cy8oOdLVWWgGaL-1MPorEEqnVv"),
  },
];

export const consejeriaDocs: SheetDoc[] = [
  {
    key: "actas-consejeria-superior",
    title: "Actas Consejería Superior",
    type: "folder",
    driveId: "1xlY72kWuW5nYbq5ln03j_OQqfSUgD-IW",
    embedUrl: driveFolder("1xlY72kWuW5nYbq5ln03j_OQqfSUgD-IW"),
    downloadUrl: driveFolder("1xlY72kWuW5nYbq5ln03j_OQqfSUgD-IW"),
  },
];