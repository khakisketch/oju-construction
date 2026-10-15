export interface License {
  id: string;
  name: string;
  number: string;
  issueDate: string;
  expiryDate: string;
  issuingAuthority: string;
  capacity?: string;
}

export interface Technician {
  id: string;
  name: string;
  position: string;
  qualification: string;
  licenseNumber: string;
  experienceYears: number;
}

export interface Equipment {
  id: string;
  name: string;
  model: string;
  quantity: number;
  condition: string;
  registrationNumber?: string;
}

export interface CreditRating {
  grade: string;
  agency: string;
  evaluationDate: string;
  validUntil: string;
}

export interface NominationData {
  licenses: License[];
  technicians: Technician[];
  equipment: Equipment[];
  creditRating: CreditRating;
  updatedAt?: Date;
}

export const defaultNominationData: NominationData = {
  licenses: [],
  technicians: [],
  equipment: [],
  creditRating: {
    grade: "",
    agency: "",
    evaluationDate: "",
    validUntil: "",
  },
};
