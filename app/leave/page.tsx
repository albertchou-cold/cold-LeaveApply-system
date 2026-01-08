'use client';

import { useState, useEffect, useCallback } from 'react';
import LeaveForm from '@/app/components/LeaveForm';
import LeaveList from '@/app/components/LeaveList';
import { LeaveApplication, LeaveApplicationRequest, LeaveStatus } from '@/app/types/leave';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/app/contexts/AuthContext';


export default function LeavePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [applications, setApplications] = useState<LeaveApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'apply' | 'list' | 'manage'>('apply');

  // 載入請假申請列表
  const loadApplications = useCallback(async () => {
    setLoading(true);
    console.log("user" , user)
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/leave', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setApplications(Array.isArray(data.data) ? data.data : [data.data].filter(Boolean));
      } else {
        alert('載入失敗: ' + data.message);
      }
    } catch (error) {
      alert('載入失敗: ' + (error instanceof Error ? error.message : '未知錯誤'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  // 提交請假申請
  const handleSubmit = async (applicationData: LeaveApplicationRequest) => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/leave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });

      const data = await response.json();
      if (data.success) {
        alert('請假申請提交成功！');
        loadApplications(); // 重新載入列表
        setActiveTab('list'); // 切換到列表頁面
      } else {
        alert('提交失敗: ' + data.message);
      }
    } catch (error) {
      alert('提交失敗: ' + (error instanceof Error ? error.message : '未知錯誤'));
    } finally {
      setSubmitting(false);
    }
  };

  // 核准請假申請
  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/api/leave/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: LeaveStatus.APPROVED,
          managerId: user?.employeeId || '',
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('已核准請假申請');
        loadApplications(); // 重新載入列表
      } else {
        alert('核准失敗: ' + data.message);
      }
    } catch (error) {
      alert('核准失敗: ' + (error instanceof Error ? error.message : '未知錯誤'));
    }
  };

  // 拒絕請假申請
  const handleReject = async (id: string, reason: string) => {
    try {
      const response = await fetch(`/api/leave/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: LeaveStatus.REJECTED,
          managerId: user?.employeeId || '',
          rejectionReason: reason? reason : '自行銷假',
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('已拒絕請假申請');
        loadApplications();
      } else {
        alert('拒絕失敗: ' + data.message);
      }
    } catch (error) {
      alert('拒絕失敗: ' + (error instanceof Error ? error.message : '未知錯誤'));
    }
  };

  useEffect(() => {
    if (activeTab === 'list' || activeTab === 'manage') {
      loadApplications();
    }
  }, [activeTab, loadApplications]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* 標題 */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          {t('titleLeave.title')}
        </h1>

        {/* 導航標籤 */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white rounded-lg shadow-sm border">
            <button
              onClick={() => setActiveTab('apply')}
              className={`px-6 py-3 rounded-l-lg font-medium transition duration-200 ${
                activeTab === 'apply'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {t('titleLeave.leaveApply')}
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`px-6 py-3 font-medium transition duration-200 ${
                activeTab === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {t('titleLeave.checkLeave')}
            </button>
            {/* <button
              onClick={() => setActiveTab('manage')}
              className={`px-6 py-3 rounded-r-lg font-medium transition duration-200 
                text-pretty
                ${
                activeTab === 'manage'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {t('titleLeave.manageLeaveApply')}
            </button> */}
          </div>
        </div>

        {/* 內容區域 */}
        <div className="max-w-4xl mx-auto">
          {/* 員工可以申請和查看自己的請假 */}
          {user && (
            <>
              {activeTab === 'apply' && (
                <LeaveForm onSubmit={handleSubmit} loading={submitting} />
              )}

              {activeTab === 'list' && (
                <div>
                  {loading ? (
                    <div className="text-center py-8">{t('loading')}</div>
                  ) : (
                    <LeaveList applications={applications} />
                  )}
                </div>
              )}
            </>
          )}
          
          {/* 只有管理者可以管理他人的請假申請 */}
          {/* {activeTab === 'manage' && (
            user && user.role !== "employee" ? (
              <div>
                {
                  loading ? (
                    <div className="text-center py-8">{t('loading')}</div>
                  ) : (
                    <LeaveList
                      applications={applications}
                      onApprove={handleApprove}
                      onReject={handleReject}
                      showActions={true}
                    />
                  )
                }
              </div>
            ) : (
              <div className="text-center py-8">
                {t('errors.unauthorized')}
              </div>
            )
          )} */}
        </div>
      </div>
    </div>
  );
}
