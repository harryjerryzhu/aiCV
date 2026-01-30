import React from 'react';
import { Plus, Trash2, Wand2, Upload, Target, Trophy, Users, Heart } from 'lucide-react';
import { CVData, Experience, Education, Award, Membership } from '../types';

interface CVFormProps {
  data: CVData;
  onChange: (data: CVData) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const CVForm: React.FC<CVFormProps> = ({ data, onChange, onGenerate, isGenerating }) => {
  
  const updateField = (field: keyof CVData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ ...data, photoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    onChange({ ...data, photoUrl: '' });
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: Math.random().toString(36).substr(2, 9),
      jobTitle: '',
      company: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    onChange({ ...data, experience: [...data.experience, newExp] });
  };

  const removeExperience = (id: string) => {
    onChange({ ...data, experience: data.experience.filter(e => e.id !== id) });
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    onChange({
      ...data,
      experience: data.experience.map(e => e.id === id ? { ...e, [field]: value } : e)
    });
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Math.random().toString(36).substr(2, 9),
      school: '',
      degree: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    onChange({ ...data, education: [...data.education, newEdu] });
  };

  const removeEducation = (id: string) => {
    onChange({ ...data, education: data.education.filter(e => e.id !== id) });
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    onChange({
      ...data,
      education: data.education.map(e => e.id === id ? { ...e, [field]: value } : e)
    });
  };

  const addAward = () => {
    const newAward: Award = {
      id: Math.random().toString(36).substr(2, 9),
      title: '',
      issuer: '',
      date: '',
      description: ''
    };
    onChange({ ...data, awards: [...data.awards, newAward] });
  };

  const removeAward = (id: string) => {
    onChange({ ...data, awards: data.awards.filter(a => a.id !== id) });
  };

  const updateAward = (id: string, field: keyof Award, value: string) => {
    onChange({
      ...data,
      awards: data.awards.map(a => a.id === id ? { ...a, [field]: value } : a)
    });
  };

  const addMembership = () => {
    const newMembership: Membership = {
      id: Math.random().toString(36).substr(2, 9),
      role: '',
      organization: '',
      date: ''
    };
    onChange({ ...data, memberships: [...data.memberships, newMembership] });
  };

  const removeMembership = (id: string) => {
    onChange({ ...data, memberships: data.memberships.filter(m => m.id !== id) });
  };

  const updateMembership = (id: string, field: keyof Membership, value: string) => {
    onChange({
      ...data,
      memberships: data.memberships.map(m => m.id === id ? { ...m, [field]: value } : m)
    });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header / Actions */}
      <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-indigo-900">Content Editor</h2>
          <p className="text-sm text-indigo-700">Fill in your details, then let Gemini polish it.</p>
        </div>
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-white font-medium transition-all ${
            isGenerating 
              ? 'bg-indigo-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow-md'
          }`}
        >
          <Wand2 size={18} className={isGenerating ? "animate-spin" : ""} />
          {isGenerating ? 'Polishing...' : 'Polish with AI'}
        </button>
      </div>

      {/* Target Role & Company */}
      <section className="space-y-4">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-indigo-900 font-bold text-lg">
                <Target size={20} className="text-indigo-600"/> 
                <h3>Target Role & Company</h3>
            </div>
            <p className="text-xs text-indigo-600 mb-4 leading-relaxed">
                Provide details about the job you're applying for. Gemini will optimize your CV content to match this specific role.
            </p>
            <div className="space-y-3">
                <Input 
                    label="Target Company Name" 
                    value={data.targetCompany} 
                    onChange={v => updateField('targetCompany', v)} 
                    placeholder="e.g. Google, Amazon, Startup Inc."
                    className="bg-white"
                />
                <Input 
                    label="Target Role / Job Title" 
                    value={data.targetRole} 
                    onChange={v => updateField('targetRole', v)} 
                    placeholder="e.g. Senior Frontend Engineer" 
                    className="bg-white"
                />
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Description / Brief</label>
                    <textarea
                        className="w-full min-h-[80px] p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm bg-white"
                        placeholder="Paste the job description or a brief summary of what they are looking for..."
                        value={data.targetJobDescription}
                        onChange={(e) => updateField('targetJobDescription', e.target.value)}
                    />
                </div>
            </div>
        </div>
      </section>

      {/* Personal Info */}
      <section id="form-personal" className="space-y-4 scroll-mt-20">
        <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Personal Information</h3>
        
        {/* Photo Upload */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
           <div className="relative shrink-0">
             {data.photoUrl ? (
               <img 
                 src={data.photoUrl} 
                 alt="Profile" 
                 className="w-16 h-16 rounded-full object-cover border-2 border-indigo-100" 
               />
             ) : (
               <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                 <Upload size={24} />
               </div>
             )}
             {data.photoUrl && (
                <button 
                  onClick={removePhoto}
                  className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  title="Remove photo"
                >
                  <Trash2 size={12} />
                </button>
             )}
           </div>
           <div className="w-full">
             <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
             <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
             />
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Full Name" value={data.fullName} onChange={v => updateField('fullName', v)} placeholder="John Doe" />
          <Input label="Job Title / Headline" value={data.summary.split('.')[0] || ''} onChange={() => {}} disabled placeholder="(Auto-generated from summary)" />
          <Input label="Email" value={data.email} onChange={v => updateField('email', v)} type="email" placeholder="john@example.com" />
          <Input label="Phone" value={data.phone} onChange={v => updateField('phone', v)} type="tel" placeholder="+1 234 567 890" />
          <Input label="Location" value={data.location} onChange={v => updateField('location', v)} placeholder="New York, NY" />
          <Input label="LinkedIn" value={data.linkedin} onChange={v => updateField('linkedin', v)} placeholder="linkedin.com/in/john" />
          <Input label="Website" value={data.website} onChange={v => updateField('website', v)} placeholder="portfolio.com" />
        </div>
      </section>

      {/* Summary */}
      <section id="form-summary" className="space-y-4 scroll-mt-20">
        <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Professional Summary</h3>
        <textarea
          className="w-full min-h-[120px] p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-y"
          placeholder="Briefly describe your professional background and goals..."
          value={data.summary}
          onChange={(e) => updateField('summary', e.target.value)}
        />
      </section>

      {/* Experience */}
      <section className="space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-xl font-bold text-gray-800">Experience</h3>
          <button onClick={addExperience} className="text-sm flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium">
            <Plus size={16} /> Add Job
          </button>
        </div>
        <div className="space-y-6">
          {data.experience.map((exp, index) => (
            <div 
              key={exp.id} 
              id={`form-experience-${exp.id}`}
              className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm space-y-3 relative group scroll-mt-20"
            >
              <button 
                onClick={() => removeExperience(exp.id)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                title="Remove"
              >
                <Trash2 size={18} />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                <Input label="Job Title" value={exp.jobTitle} onChange={v => updateExperience(exp.id, 'jobTitle', v)} />
                <Input label="Company" value={exp.company} onChange={v => updateExperience(exp.id, 'company', v)} />
                <Input label="Start Date" value={exp.startDate} onChange={v => updateExperience(exp.id, 'startDate', v)} placeholder="Jan 2020" />
                <Input label="End Date" value={exp.endDate} onChange={v => updateExperience(exp.id, 'endDate', v)} placeholder="Present" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                  placeholder="• Led a team of 5 engineers..."
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                />
              </div>
            </div>
          ))}
          {data.experience.length === 0 && (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              No experience added yet.
            </div>
          )}
        </div>
      </section>

      {/* Education */}
      <section className="space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-xl font-bold text-gray-800">Education</h3>
          <button onClick={addEducation} className="text-sm flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium">
            <Plus size={16} /> Add School
          </button>
        </div>
        <div className="space-y-6">
          {data.education.map((edu) => (
            <div 
              key={edu.id} 
              id={`form-education-${edu.id}`}
              className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm space-y-3 relative group scroll-mt-20"
            >
              <button 
                onClick={() => removeEducation(edu.id)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                title="Remove"
              >
                <Trash2 size={18} />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                <Input label="School / University" value={edu.school} onChange={v => updateEducation(edu.id, 'school', v)} />
                <Input label="Degree" value={edu.degree} onChange={v => updateEducation(edu.id, 'degree', v)} />
                <Input label="Start Date" value={edu.startDate} onChange={v => updateEducation(edu.id, 'startDate', v)} placeholder="2016" />
                <Input label="End Date" value={edu.endDate} onChange={v => updateEducation(edu.id, 'endDate', v)} placeholder="2020" />
              </div>
            </div>
          ))}
             {data.education.length === 0 && (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              No education added yet.
            </div>
          )}
        </div>
      </section>

      {/* Awards */}
      <section className="space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            Awards <Trophy size={16} className="text-gray-400" />
          </h3>
          <button onClick={addAward} className="text-sm flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium">
            <Plus size={16} /> Add Award
          </button>
        </div>
        <div className="space-y-6">
          {data.awards.map((award) => (
            <div 
              key={award.id} 
              className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm space-y-3 relative group"
            >
              <button 
                onClick={() => removeAward(award.id)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                title="Remove"
              >
                <Trash2 size={18} />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                <Input label="Award Title" value={award.title} onChange={v => updateAward(award.id, 'title', v)} placeholder="e.g. Employee of the Month" />
                <Input label="Issuer / Organization" value={award.issuer} onChange={v => updateAward(award.id, 'issuer', v)} placeholder="e.g. Company Inc." />
                <Input label="Date" value={award.date} onChange={v => updateAward(award.id, 'date', v)} placeholder="Jun 2023" />
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <textarea
                  className="w-full min-h-[60px] p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                  placeholder="Brief details about the recognition..."
                  value={award.description}
                  onChange={(e) => updateAward(award.id, 'description', e.target.value)}
                />
              </div>
            </div>
          ))}
           {data.awards.length === 0 && (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              No awards added yet.
            </div>
          )}
        </div>
      </section>

      {/* Memberships */}
      <section className="space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            Memberships <Users size={16} className="text-gray-400" />
          </h3>
          <button onClick={addMembership} className="text-sm flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium">
            <Plus size={16} /> Add Membership
          </button>
        </div>
        <div className="space-y-6">
          {data.memberships.map((membership) => (
            <div 
              key={membership.id} 
              className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm space-y-3 relative group"
            >
              <button 
                onClick={() => removeMembership(membership.id)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                title="Remove"
              >
                <Trash2 size={18} />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                <Input label="Role" value={membership.role} onChange={v => updateMembership(membership.id, 'role', v)} placeholder="e.g. Member, Board Member" />
                <Input label="Organization" value={membership.organization} onChange={v => updateMembership(membership.id, 'organization', v)} placeholder="e.g. IEEE, Local Rotary Club" />
                <Input label="Date / Duration" value={membership.date} onChange={v => updateMembership(membership.id, 'date', v)} placeholder="2021 - Present" />
              </div>
            </div>
          ))}
           {data.memberships.length === 0 && (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              No memberships added yet.
            </div>
          )}
        </div>
      </section>

      {/* Skills & Interests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section id="form-skills" className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Skills</h3>
          <textarea
            className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            placeholder="React, TypeScript, Project Management, Public Speaking..."
            value={data.skills}
            onChange={(e) => updateField('skills', e.target.value)}
          />
          <p className="text-xs text-gray-500">Separate skills with commas.</p>
        </section>

        <section id="form-interests" className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
             Interests <Heart size={16} className="text-gray-400" />
          </h3>
          <textarea
            className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            placeholder="Photography, Hiking, Open Source Contributing..."
            value={data.interests}
            onChange={(e) => updateField('interests', e.target.value)}
          />
          <p className="text-xs text-gray-500">Separate interests with commas.</p>
        </section>
      </div>

    </div>
  );
};

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  onChange: (value: string) => void; // Override standard onChange
  value: string;
}

const Input: React.FC<InputProps> = ({ label, onChange, value, className = "", ...props }) => (
  <div className="w-full">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      className={`w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      {...props}
    />
  </div>
);