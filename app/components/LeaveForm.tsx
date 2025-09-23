'use client';

import { useState } from 'react';
import { LeaveType, LeaveApplicationRequest } from '@/app/types/leave';
import { useAuth } from '@/app/contexts/AuthContext';
import { useTranslation } from 'react-i18next';

interface LeaveFormProps {
  onSubmit: (application: LeaveApplicationRequest) => void;
  loading: boolean;
}

export default function LeaveForm({ onSubmit, loading }: LeaveFormProps) {
  const { t } = useTranslation();
  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const { user } = useAuth();

  const [formData, setFormData] = useState<LeaveApplicationRequest>({
    employeeId: user?.employeeId || '',
    employeeName: user?.fullName || '',
    leaveType: LeaveType.ANNUAL,
    startDate: getCurrentDateTime(),
    endDate: getCurrentDateTime(),
    reason: '',
    applyFolderLink: '',
    department: user?.department || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.startDate <= formData.endDate) {
      onSubmit(formData);
    } else {
      alert('結束日期必須晚於開始日期');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">{t('leave.application')}</h2>
      
      <div className="mb-4">
        <label htmlFor="employeeId" className="block text-lg font-extrabold text-gray-700 mb-2">
          {t('leave.employeeId')}
        </label>
        <input
          type="text"
          id="employeeId"
          name="employeeId"
          value={formData.employeeId}
          onChange={handleInputChange}
          required
          disabled
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={t('inputSomething')}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="employeeName" className="block font-bold text-lg text-gray-700 mb-2">
          {t('leave.employeeName')}
        </label>
        <input
          type="text"
          id="employeeName"
          name="employeeName"
          value={formData.employeeName}
          onChange={handleInputChange}
          required
          disabled
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={t('inputSomething')}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="leaveType" className="block font-bold text-lg text-gray-700 mb-2">
          {t('leave.type')}
        </label>
        <select
          id="leaveType"
          name="leaveType"
          value={formData.leaveType}
          onChange={handleInputChange}
          required
          disabled={loading}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {Object.values(LeaveType).map((type) => (
            <option key={type} value={type}>
              {t(`leaveTypes.${type.toLowerCase()}`)}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="startDate" className="block font-bold text-lg text-gray-700 mb-2">
          {t('leave.startDate')}
        </label>
        <input
          type="datetime-local"
          id="startDate"
          name="startDate"
          value={formData.startDate}
          onChange={handleInputChange}
          required
          disabled={loading}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="endDate" className="block font-bold text-lg text-gray-700 mb-2">
          {t('leave.endDate')}
        </label>
        <input
          type="datetime-local"
          id="endDate"
          name="endDate"
          value={formData.endDate}
          onChange={handleInputChange}
          required
          disabled={loading}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="reason" className="block font-bold text-lg text-gray-700 mb-2">
          {t('leave.reason')}
        </label>
        
        <textarea
          id="reason"
          name="reason"
          value={formData.reason}
          onChange={handleInputChange}
          required
          disabled={loading}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={t('inputSomething')}
        />
      </div>

      <div className="mb-6">
        <label htmlFor="applyFolderLink" className="block font-bold text-lg text-gray-700 mb-2">
          {t('leave.folderLink')}
        </label>
        <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
          {t('leave.reasonTips')}
        </label>
        <a href="https://www.canva.com/design/DAGuyXGQ0GY/MSDagX8ZQZIllr4FarncTA/edit?utm_content=DAGuyXGQ0GY&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 underline mr-2 text-sm">
          Link Tips
        </a>
        <textarea
          id="applyFolderLink"
          name="applyFolderLink"
          value={formData.applyFolderLink}
          onChange={handleInputChange}
          required
          disabled={loading}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 "
          placeholder={t('inputSomething')}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition duration-200"
      >
        {loading ? t('submitting') : t('submit')}
      </button>
    </form>
  );
}
