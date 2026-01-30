import React, { useState, useRef, useLayoutEffect } from 'react';
import { CVData, Experience, Education, Award, Membership } from '../types';
import { Mail, Phone, MapPin, Linkedin, Globe, Download, LayoutTemplate, Palette } from 'lucide-react';

interface CVPreviewProps {
  data: CVData;
  onChange: (data: CVData) => void;
}

type TemplateType = 'modern' | 'classic' | 'minimal';

const COLORS = [
  "#111827", // Gray-900 (Black)
  "#4f46e5", // Indigo-600
  "#2563eb", // Blue-600
  "#059669", // Emerald-600
  "#dc2626", // Red-600
  "#7c3aed", // Violet-600
  "#ea580c", // Orange-600
  "#be185d", // Pink-700
];

// --- Helper Components for Direct Editing ---

const EditableInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { onValueChange: (val: string) => void }> = ({ 
  value, 
  onValueChange, 
  className = "", 
  placeholder,
  ...props 
}) => {
  return (
    <input
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className={`bg-transparent border-b border-transparent hover:border-gray-300 focus:border-indigo-500 outline-none transition-colors w-full placeholder-gray-300 ${className}`}
      placeholder={placeholder}
      {...props}
    />
  );
};

const EditableTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { onValueChange: (val: string) => void }> = ({ 
  value, 
  onValueChange, 
  className = "", 
  ...props 
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize
  useLayoutEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      rows={1}
      className={`bg-transparent border border-transparent hover:border-gray-300 focus:border-indigo-500 outline-none transition-colors w-full resize-none overflow-hidden ${className}`}
      {...props}
    />
  );
};


// --- Layouts ---

// 1. Modern Layout
const ModernLayout: React.FC<CVPreviewProps> = ({ data, onChange }) => {
  const theme = { color: data.themeColor || '#4f46e5' };
  
  const updateExperience = (index: number, field: keyof Experience, val: string) => {
    const newExp = [...data.experience];
    newExp[index] = { ...newExp[index], [field]: val };
    onChange({ ...data, experience: newExp });
  };

  const updateEducation = (index: number, field: keyof Education, val: string) => {
    const newEdu = [...data.education];
    newEdu[index] = { ...newEdu[index], [field]: val };
    onChange({ ...data, education: newEdu });
  };

  const updateAward = (index: number, field: keyof Award, val: string) => {
      const newAwards = [...data.awards];
      newAwards[index] = { ...newAwards[index], [field]: val };
      onChange({ ...data, awards: newAwards });
  };

  const updateMembership = (index: number, field: keyof Membership, val: string) => {
      const newMemberships = [...data.memberships];
      newMemberships[index] = { ...newMemberships[index], [field]: val };
      onChange({ ...data, memberships: newMemberships });
  };

  return (
    <div className="h-full bg-white shadow-xl text-gray-800 p-[40px] flex flex-col text-sm font-sans">
      <header className="border-b-2 pb-6 mb-6 flex justify-between items-start gap-4" style={{ borderColor: theme.color }}>
        <div className="flex-1 min-w-0">
          <EditableInput 
            value={data.fullName} 
            onValueChange={(v) => onChange({...data, fullName: v})}
            className="text-4xl font-bold uppercase tracking-tight text-gray-900 mb-2"
            placeholder="YOUR NAME"
            style={{ color: theme.color }}
          />
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-gray-600 text-xs">
             <div className="flex items-center gap-1">
                <Mail size={12} />
                <EditableInput value={data.email} onValueChange={(v) => onChange({...data, email: v})} className="w-auto min-w-[100px]" placeholder="Email" />
             </div>
             <div className="flex items-center gap-1">
                <Phone size={12} />
                <EditableInput value={data.phone} onValueChange={(v) => onChange({...data, phone: v})} className="w-auto min-w-[100px]" placeholder="Phone" />
             </div>
             <div className="flex items-center gap-1">
                <MapPin size={12} />
                <EditableInput value={data.location} onValueChange={(v) => onChange({...data, location: v})} className="w-auto min-w-[100px]" placeholder="Location" />
             </div>
             <div className="flex items-center gap-1">
                <Linkedin size={12} />
                <EditableInput value={data.linkedin} onValueChange={(v) => onChange({...data, linkedin: v})} className="w-auto min-w-[100px]" placeholder="LinkedIn" />
             </div>
             <div className="flex items-center gap-1">
                <Globe size={12} />
                <EditableInput value={data.website} onValueChange={(v) => onChange({...data, website: v})} className="w-auto min-w-[100px]" placeholder="Website" />
             </div>
          </div>
        </div>
        {data.photoUrl && (
          <img src={data.photoUrl} alt="Profile" className="w-24 h-24 rounded-lg object-cover border" style={{ borderColor: theme.color }} />
        )}
      </header>

      <div className="flex gap-8 flex-grow">
        <div className="w-2/3 flex flex-col gap-6">
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3 border-b border-gray-200 pb-1" style={{ color: theme.color }}>Profile</h2>
            <EditableTextarea 
              value={data.summary} 
              onValueChange={(v) => onChange({...data, summary: v})}
              className="text-gray-700 leading-relaxed text-justify whitespace-pre-wrap"
              placeholder="Professional summary..."
            />
          </section>

          {data.experience.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 border-b border-gray-200 pb-1" style={{ color: theme.color }}>Experience</h2>
              <div className="flex flex-col gap-5">
                {data.experience.map((exp, i) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <EditableInput 
                        value={exp.jobTitle} 
                        onValueChange={(v) => updateExperience(i, 'jobTitle', v)}
                        className="font-bold text-gray-900 w-2/3"
                        placeholder="Job Title"
                      />
                      <div className="flex gap-1 text-xs text-gray-500 font-medium whitespace-nowrap">
                         <EditableInput value={exp.startDate} onValueChange={v => updateExperience(i, 'startDate', v)} className="w-16 text-right" placeholder="Start" />
                         <span>–</span>
                         <EditableInput value={exp.endDate} onValueChange={v => updateExperience(i, 'endDate', v)} className="w-16" placeholder="End" />
                      </div>
                    </div>
                    <EditableInput 
                      value={exp.company} 
                      onValueChange={(v) => updateExperience(i, 'company', v)}
                      className="font-medium text-xs mb-2 w-full"
                      style={{ color: theme.color }}
                      placeholder="Company"
                    />
                    <EditableTextarea 
                       value={exp.description}
                       onValueChange={(v) => updateExperience(i, 'description', v)}
                       className="text-gray-700 leading-relaxed text-xs whitespace-pre-line"
                       placeholder="Job description..."
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.awards.length > 0 && (
             <section>
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 border-b border-gray-200 pb-1" style={{ color: theme.color }}>Awards</h2>
                <div className="flex flex-col gap-4">
                  {data.awards.map((award, i) => (
                     <div key={award.id}>
                        <div className="flex justify-between items-baseline">
                           <EditableInput value={award.title} onValueChange={v => updateAward(i, 'title', v)} className="font-bold text-gray-900" placeholder="Title" />
                           <EditableInput value={award.date} onValueChange={v => updateAward(i, 'date', v)} className="text-xs text-gray-500 text-right w-20" placeholder="Date" />
                        </div>
                        <EditableInput value={award.issuer} onValueChange={v => updateAward(i, 'issuer', v)} className="text-xs font-medium" style={{ color: theme.color }} placeholder="Issuer" />
                        <EditableTextarea value={award.description} onValueChange={v => updateAward(i, 'description', v)} className="text-gray-700 leading-relaxed text-xs mt-1" placeholder="Description..." />
                     </div>
                  ))}
                </div>
             </section>
          )}
          
          {/* Memberships in Main Column */}
          {data.memberships.length > 0 && (
             <section>
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 border-b border-gray-200 pb-1" style={{ color: theme.color }}>Memberships</h2>
                <div className="flex flex-col gap-3">
                  {data.memberships.map((membership, i) => (
                     <div key={membership.id} className="flex justify-between items-baseline border-b border-gray-50 pb-2 last:border-0">
                        <div>
                           <EditableInput value={membership.role} onValueChange={v => updateMembership(i, 'role', v)} className="font-bold text-gray-800 text-xs" placeholder="Role" />
                           <EditableInput value={membership.organization} onValueChange={v => updateMembership(i, 'organization', v)} className="text-xs text-gray-600" placeholder="Organization" />
                        </div>
                        <EditableInput value={membership.date} onValueChange={v => updateMembership(i, 'date', v)} className="text-xs text-gray-400 text-right w-24" placeholder="Date" />
                     </div>
                  ))}
                </div>
             </section>
          )}
        </div>

        <div className="w-1/3 flex flex-col gap-6">
          {data.education.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 border-b border-gray-200 pb-1" style={{ color: theme.color }}>Education</h2>
              <div className="flex flex-col gap-4">
                {data.education.map((edu, i) => (
                  <div key={edu.id}>
                     <EditableInput 
                       value={edu.school} 
                       onValueChange={(v) => updateEducation(i, 'school', v)}
                       className="font-bold text-gray-900 leading-tight"
                       placeholder="School"
                     />
                     <EditableInput 
                       value={edu.degree} 
                       onValueChange={(v) => updateEducation(i, 'degree', v)}
                       className="text-xs mt-1"
                       style={{ color: theme.color }}
                       placeholder="Degree"
                     />
                     <div className="flex gap-1 text-gray-400 text-xs mt-1">
                       <EditableInput value={edu.startDate} onValueChange={v => updateEducation(i, 'startDate', v)} className="w-10" />
                       <span>–</span>
                       <EditableInput value={edu.endDate} onValueChange={v => updateEducation(i, 'endDate', v)} className="w-10" />
                     </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 border-b border-gray-200 pb-1" style={{ color: theme.color }}>Skills</h2>
            <EditableTextarea 
              value={data.skills}
              onValueChange={(v) => onChange({...data, skills: v})}
              className="bg-gray-50 p-2 rounded text-xs leading-relaxed"
              placeholder="List your skills..."
            />
          </section>

          {data.interests && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 border-b border-gray-200 pb-1" style={{ color: theme.color }}>Interests</h2>
              <EditableTextarea 
                value={data.interests}
                onValueChange={(v) => onChange({...data, interests: v})}
                className="bg-white text-gray-600 text-xs leading-relaxed"
                placeholder="List your interests..."
              />
            </section>
          )}
        </div>
      </div>
    </div>
  );
};


// 2. Classic Layout
const ClassicLayout: React.FC<CVPreviewProps> = ({ data, onChange }) => {
  const theme = { color: data.themeColor || '#111827' };

  const updateExperience = (index: number, field: keyof Experience, val: string) => {
    const newExp = [...data.experience];
    newExp[index] = { ...newExp[index], [field]: val };
    onChange({ ...data, experience: newExp });
  };
  const updateEducation = (index: number, field: keyof Education, val: string) => {
    const newEdu = [...data.education];
    newEdu[index] = { ...newEdu[index], [field]: val };
    onChange({ ...data, education: newEdu });
  };
   const updateAward = (index: number, field: keyof Award, val: string) => {
      const newAwards = [...data.awards];
      newAwards[index] = { ...newAwards[index], [field]: val };
      onChange({ ...data, awards: newAwards });
  };
  const updateMembership = (index: number, field: keyof Membership, val: string) => {
      const newMemberships = [...data.memberships];
      newMemberships[index] = { ...newMemberships[index], [field]: val };
      onChange({ ...data, memberships: newMemberships });
  };

  return (
    <div className="h-full bg-white shadow-xl text-gray-900 p-[48px] flex flex-col text-sm font-serif">
      {/* Header */}
      <header className="text-center mb-8 border-b-2 pb-6" style={{ borderColor: theme.color }}>
        <EditableInput 
            value={data.fullName} 
            onValueChange={(v) => onChange({...data, fullName: v})}
            className="text-3xl font-bold uppercase tracking-widest text-center mb-4"
            placeholder="YOUR NAME"
            style={{ color: theme.color }}
        />
        <div className="flex flex-wrap justify-center gap-4 text-sm italic">
           <EditableInput value={data.email} onValueChange={(v) => onChange({...data, email: v})} className="w-auto text-center" />
           <span className="text-gray-400">•</span>
           <EditableInput value={data.phone} onValueChange={(v) => onChange({...data, phone: v})} className="w-auto text-center" />
           <span className="text-gray-400">•</span>
           <EditableInput value={data.location} onValueChange={(v) => onChange({...data, location: v})} className="w-auto text-center" />
           {data.linkedin && (
             <>
               <span className="text-gray-400">•</span>
               <EditableInput value={data.linkedin} onValueChange={(v) => onChange({...data, linkedin: v})} className="w-auto text-center" />
             </>
           )}
        </div>
      </header>

      {/* Summary */}
      <section className="mb-6">
         <h2 className="text-base font-bold uppercase border-b mb-3 pb-1" style={{ borderColor: theme.color, color: theme.color }}>Professional Summary</h2>
         <EditableTextarea 
            value={data.summary} 
            onValueChange={(v) => onChange({...data, summary: v})}
            className="text-justify leading-relaxed"
         />
      </section>

      {/* Skills */}
      <section className="mb-6">
         <h2 className="text-base font-bold uppercase border-b mb-3 pb-1" style={{ borderColor: theme.color, color: theme.color }}>Skills</h2>
         <EditableTextarea 
            value={data.skills}
            onValueChange={(v) => onChange({...data, skills: v})}
            className="italic"
         />
      </section>

      {/* Interests (Aligned Left, Stacked) */}
      {data.interests && (
        <section className="mb-6">
            <h2 className="text-base font-bold uppercase border-b mb-3 pb-1" style={{ borderColor: theme.color, color: theme.color }}>Interests</h2>
            <EditableTextarea 
                value={data.interests}
                onValueChange={(v) => onChange({...data, interests: v})}
                className="italic"
            />
        </section>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-bold uppercase border-b mb-4 pb-1" style={{ borderColor: theme.color, color: theme.color }}>Experience</h2>
          <div className="flex flex-col gap-6">
            {data.experience.map((exp, i) => (
              <div key={exp.id}>
                <div className="flex justify-between font-bold mb-1">
                   <EditableInput 
                      value={exp.company} 
                      onValueChange={(v) => updateExperience(i, 'company', v)}
                      className="w-1/2"
                   />
                   <EditableInput 
                      value={exp.jobTitle} 
                      onValueChange={(v) => updateExperience(i, 'jobTitle', v)}
                      className="w-1/2 text-right italic font-normal"
                      style={{ color: theme.color }}
                   />
                </div>
                <div className="text-xs text-gray-600 mb-2 flex justify-between">
                   <div className="flex gap-1">
                      <EditableInput value={exp.startDate} onValueChange={v => updateExperience(i, 'startDate', v)} className="w-20" /> 
                      - 
                      <EditableInput value={exp.endDate} onValueChange={v => updateExperience(i, 'endDate', v)} className="w-20" />
                   </div>
                </div>
                <EditableTextarea 
                   value={exp.description}
                   onValueChange={(v) => updateExperience(i, 'description', v)}
                   className="text-justify leading-relaxed"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-bold uppercase border-b mb-4 pb-1" style={{ borderColor: theme.color, color: theme.color }}>Education</h2>
          <div className="flex flex-col gap-4">
            {data.education.map((edu, i) => (
              <div key={edu.id} className="flex justify-between">
                 <div>
                    <EditableInput 
                       value={edu.school} 
                       onValueChange={(v) => updateEducation(i, 'school', v)}
                       className="font-bold"
                    />
                    <EditableInput 
                       value={edu.degree} 
                       onValueChange={(v) => updateEducation(i, 'degree', v)}
                       className="italic"
                       style={{ color: theme.color }}
                    />
                 </div>
                 <div className="flex gap-1 text-right">
                    <EditableInput value={edu.startDate} onValueChange={v => updateEducation(i, 'startDate', v)} className="w-12 text-right" /> 
                      - 
                    <EditableInput value={edu.endDate} onValueChange={v => updateEducation(i, 'endDate', v)} className="w-12 text-right" />
                 </div>
              </div>
            ))}
          </div>
        </section>
      )}

       {/* Awards & Memberships */}
       {(data.awards.length > 0 || data.memberships.length > 0) && (
        <section>
          <h2 className="text-base font-bold uppercase border-b mb-4 pb-1" style={{ borderColor: theme.color, color: theme.color }}>Awards & Memberships</h2>
          <div className="flex flex-col gap-4">
            {data.awards.map((award, i) => (
              <div key={award.id} className="flex justify-between">
                 <div className="w-3/4">
                    <span className="font-bold mr-2">Award:</span>
                    <EditableInput 
                       value={award.title} 
                       onValueChange={(v) => updateAward(i, 'title', v)}
                       className="inline-block w-auto font-medium"
                    />
                    <span className="mx-1">|</span>
                    <EditableInput 
                       value={award.issuer} 
                       onValueChange={(v) => updateAward(i, 'issuer', v)}
                       className="inline-block w-auto italic text-xs"
                    />
                 </div>
                 <EditableInput value={award.date} onValueChange={v => updateAward(i, 'date', v)} className="w-20 text-right text-xs" />
              </div>
            ))}
            {data.memberships.map((membership, i) => (
              <div key={membership.id} className="flex justify-between">
                 <div className="w-3/4">
                    <span className="font-bold mr-2">Member:</span>
                    <EditableInput 
                       value={membership.role} 
                       onValueChange={(v) => updateMembership(i, 'role', v)}
                       className="inline-block w-auto font-medium"
                    />
                    <span className="mx-1"> </span>
                    <EditableInput 
                       value={membership.organization} 
                       onValueChange={(v) => updateMembership(i, 'organization', v)}
                       className="inline-block w-auto italic"
                    />
                 </div>
                 <EditableInput value={membership.date} onValueChange={v => updateMembership(i, 'date', v)} className="w-20 text-right text-xs" />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};


// 3. Minimal Layout
const MinimalLayout: React.FC<CVPreviewProps> = ({ data, onChange }) => {
  const theme = { color: data.themeColor || '#475569' };

  const updateExperience = (index: number, field: keyof Experience, val: string) => {
    const newExp = [...data.experience];
    newExp[index] = { ...newExp[index], [field]: val };
    onChange({ ...data, experience: newExp });
  };
  const updateEducation = (index: number, field: keyof Education, val: string) => {
    const newEdu = [...data.education];
    newEdu[index] = { ...newEdu[index], [field]: val };
    onChange({ ...data, education: newEdu });
  };
  const updateAward = (index: number, field: keyof Award, val: string) => {
      const newAwards = [...data.awards];
      newAwards[index] = { ...newAwards[index], [field]: val };
      onChange({ ...data, awards: newAwards });
  };
   const updateMembership = (index: number, field: keyof Membership, val: string) => {
      const newMemberships = [...data.memberships];
      newMemberships[index] = { ...newMemberships[index], [field]: val };
      onChange({ ...data, memberships: newMemberships });
  };

  return (
    <div className="h-full bg-white shadow-xl text-slate-800 p-[40px] flex flex-col text-sm font-sans">
      
      {/* Header Left Aligned */}
      <header className="mb-10">
        <EditableInput 
            value={data.fullName} 
            onValueChange={(v) => onChange({...data, fullName: v})}
            className="text-5xl font-light tracking-tight text-slate-900 mb-4"
            placeholder="Your Name"
            style={{ color: theme.color }}
        />
        <div className="flex flex-wrap gap-6 text-sm text-slate-500">
           <EditableInput value={data.email} onValueChange={(v) => onChange({...data, email: v})} className="w-auto min-w-[50px]" />
           <EditableInput value={data.phone} onValueChange={(v) => onChange({...data, phone: v})} className="w-auto min-w-[50px]" />
           <EditableInput value={data.linkedin} onValueChange={(v) => onChange({...data, linkedin: v})} className="w-auto min-w-[50px]" placeholder="LinkedIn" />
           <EditableInput value={data.website} onValueChange={(v) => onChange({...data, website: v})} className="w-auto min-w-[50px]" placeholder="Website" />
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="flex flex-col gap-10">
        
        {/* Summary */}
        <div className="grid grid-cols-4 gap-4">
           <h3 className="col-span-1 font-medium uppercase text-xs tracking-widest pt-1" style={{ color: theme.color }}>About</h3>
           <div className="col-span-3">
              <EditableTextarea 
                value={data.summary} 
                onValueChange={(v) => onChange({...data, summary: v})}
                className="text-lg leading-relaxed text-slate-700 font-light"
              />
           </div>
        </div>

        {/* Experience */}
        {data.experience.length > 0 && (
           <div className="grid grid-cols-4 gap-4">
             <h3 className="col-span-1 font-medium uppercase text-xs tracking-widest pt-1" style={{ color: theme.color }}>Experience</h3>
             <div className="col-span-3 flex flex-col gap-8">
               {data.experience.map((exp, i) => (
                 <div key={exp.id}>
                    <EditableInput 
                      value={exp.jobTitle} 
                      onValueChange={(v) => updateExperience(i, 'jobTitle', v)}
                      className="text-lg font-medium text-slate-900 mb-1"
                      style={{ color: theme.color }}
                    />
                    <div className="flex justify-between text-slate-500 mb-3 text-sm">
                       <EditableInput 
                         value={exp.company} 
                         onValueChange={(v) => updateExperience(i, 'company', v)}
                         className="w-1/2"
                       />
                       <div className="flex gap-1">
                         <EditableInput value={exp.startDate} onValueChange={v => updateExperience(i, 'startDate', v)} className="w-16 text-right" /> 
                         — 
                         <EditableInput value={exp.endDate} onValueChange={v => updateExperience(i, 'endDate', v)} className="w-16 text-right" />
                       </div>
                    </div>
                    <EditableTextarea 
                       value={exp.description}
                       onValueChange={(v) => updateExperience(i, 'description', v)}
                       className="text-slate-600 leading-relaxed"
                    />
                 </div>
               ))}
             </div>
           </div>
        )}

        {/* Education */}
        {data.education.length > 0 && (
           <div className="grid grid-cols-4 gap-4">
             <h3 className="col-span-1 font-medium uppercase text-xs tracking-widest pt-1" style={{ color: theme.color }}>Education</h3>
             <div className="col-span-3 flex flex-col gap-4">
               {data.education.map((edu, i) => (
                 <div key={edu.id}>
                    <EditableInput 
                      value={edu.school} 
                      onValueChange={(v) => updateEducation(i, 'school', v)}
                      className="font-medium text-slate-900"
                    />
                    <div className="text-slate-500 text-sm flex gap-2">
                       <EditableInput value={edu.degree} onValueChange={v => updateEducation(i, 'degree', v)} className="w-auto" />
                       <span className="text-slate-300">/</span>
                       <div className="flex gap-1">
                         <EditableInput value={edu.startDate} onValueChange={v => updateEducation(i, 'startDate', v)} className="w-10" /> 
                         - 
                         <EditableInput value={edu.endDate} onValueChange={v => updateEducation(i, 'endDate', v)} className="w-10" />
                       </div>
                    </div>
                 </div>
               ))}
             </div>
           </div>
        )}

         {/* Awards */}
        {data.awards.length > 0 && (
           <div className="grid grid-cols-4 gap-4">
             <h3 className="col-span-1 font-medium uppercase text-xs tracking-widest pt-1" style={{ color: theme.color }}>Awards</h3>
             <div className="col-span-3 flex flex-col gap-4">
               {data.awards.map((award, i) => (
                 <div key={award.id}>
                    <div className="flex justify-between items-baseline">
                         <EditableInput 
                            value={award.title} 
                            onValueChange={(v) => updateAward(i, 'title', v)}
                            className="font-medium text-slate-900"
                            />
                         <EditableInput 
                            value={award.date} 
                            onValueChange={(v) => updateAward(i, 'date', v)}
                            className="w-20 text-right text-slate-400 text-xs"
                            />
                    </div>
                    <EditableInput 
                        value={award.issuer} 
                        onValueChange={(v) => updateAward(i, 'issuer', v)}
                        className="text-slate-500 text-xs"
                    />
                 </div>
               ))}
             </div>
           </div>
        )}

        {/* Memberships */}
        {data.memberships.length > 0 && (
           <div className="grid grid-cols-4 gap-4">
             <h3 className="col-span-1 font-medium uppercase text-xs tracking-widest pt-1" style={{ color: theme.color }}>Affiliations</h3>
             <div className="col-span-3 flex flex-col gap-2">
               {data.memberships.map((membership, i) => (
                 <div key={membership.id} className="flex justify-between">
                    <div>
                        <EditableInput 
                            value={membership.role} 
                            onValueChange={(v) => updateMembership(i, 'role', v)}
                            className="font-medium text-slate-900 inline-block w-auto"
                        />
                        <span className="text-slate-400 mx-1">at</span>
                        <EditableInput 
                            value={membership.organization} 
                            onValueChange={(v) => updateMembership(i, 'organization', v)}
                            className="text-slate-600 inline-block w-auto"
                        />
                    </div>
                    <EditableInput 
                        value={membership.date} 
                        onValueChange={(v) => updateMembership(i, 'date', v)}
                        className="text-slate-400 text-xs text-right w-24"
                    />
                 </div>
               ))}
             </div>
           </div>
        )}

         {/* Skills */}
         <div className="grid grid-cols-4 gap-4">
           <h3 className="col-span-1 font-medium uppercase text-xs tracking-widest pt-1" style={{ color: theme.color }}>Skills</h3>
           <div className="col-span-3">
              <EditableTextarea 
                value={data.skills} 
                onValueChange={(v) => onChange({...data, skills: v})}
                className="text-slate-600"
              />
           </div>
        </div>

        {/* Interests */}
        {data.interests && (
           <div className="grid grid-cols-4 gap-4">
             <h3 className="col-span-1 font-medium uppercase text-xs tracking-widest pt-1" style={{ color: theme.color }}>Interests</h3>
             <div className="col-span-3">
                <EditableTextarea 
                    value={data.interests} 
                    onValueChange={(v) => onChange({...data, interests: v})}
                    className="text-slate-600"
                />
             </div>
           </div>
        )}

      </div>
    </div>
  );
};


// --- Main Preview Component ---

export const CVPreview: React.FC<CVPreviewProps> = ({ data, onChange }) => {
  const [template, setTemplate] = useState<TemplateType>('modern');
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="relative h-full flex flex-col items-center">
      
      {/* Toolbar */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-center mb-4 print:hidden px-2 gap-3">
        
        <div className="flex items-center gap-3">
            {/* Template Selector */}
            <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
            <div className="px-2 text-xs font-medium text-gray-500 flex items-center gap-1">
                <LayoutTemplate size={14} /> Layout
            </div>
            <div className="flex gap-1">
                {(['modern', 'classic', 'minimal'] as TemplateType[]).map((t) => (
                    <button
                    key={t}
                    onClick={() => setTemplate(t)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors capitalize ${
                        template === t 
                        ? 'bg-gray-800 text-white shadow-sm' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    >
                    {t}
                    </button>
                ))}
            </div>
            </div>

            {/* Color Picker */}
             <div className="flex items-center gap-2 bg-white p-1.5 rounded-lg border border-gray-200 shadow-sm">
               <div className="px-1 text-gray-500">
                  <Palette size={14} />
               </div>
               <div className="flex gap-1">
                  {COLORS.map((c) => (
                     <button
                        key={c}
                        onClick={() => onChange({ ...data, themeColor: c })}
                        className={`w-5 h-5 rounded-full border border-gray-100 transition-transform hover:scale-110 ${data.themeColor === c ? 'ring-2 ring-offset-1 ring-gray-400' : ''}`}
                        style={{ backgroundColor: c }}
                        title={c}
                     />
                  ))}
               </div>
             </div>
        </div>

        {/* Actions */}
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors shadow-sm text-sm"
        >
          <Download size={16} />
          <span>Download PDF</span>
        </button>
      </div>

      {/* The A4 Page Container */}
      <div className="a4-page print-area">
        {template === 'modern' && <ModernLayout data={data} onChange={onChange} />}
        {template === 'classic' && <ClassicLayout data={data} onChange={onChange} />}
        {template === 'minimal' && <MinimalLayout data={data} onChange={onChange} />}
      </div>
    </div>
  );
};