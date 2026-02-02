export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export interface Membership {
  id: string;
  role: string;
  organization: string;
  date: string;
}

export interface CVData {
  // Target Info for AI Context
  targetCompany: string;
  targetRole: string;
  targetJobDescription: string;

  // Visuals
  themeColor: string;

  // Personal
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  photoUrl?: string; // Optional profile photo data URL
  headline: string; // Job title / headline
  summary: string;
  skills: string; // Stored as comma separated string for easy editing
  interests: string; // Stored as comma separated string
  experience: Experience[];
  education: Education[];
  awards: Award[];
  memberships: Membership[];
}

export const INITIAL_CV_DATA: CVData = {
  targetCompany: "",
  targetRole: "",
  targetJobDescription: "",
  themeColor: "#4f46e5", // Default Indigo
  fullName: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  website: "",
  photoUrl: "",
  headline: "",
  summary: "",
  skills: "",
  interests: "",
  experience: [],
  education: [],
  awards: [],
  memberships: []
};