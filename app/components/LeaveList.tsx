'use client';

import { LeaveApplication, LeaveStatus } from '@/app/types/leave';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/app/contexts/AuthContext';

interface LeaveListProps {
  applications: LeaveApplication[];
  onApprove?: (id: string) => void;
  onReject?: (id: string, reason: string) => void;
  showActions?: boolean;
}

export default function LeaveList({ 
  applications, 
  onApprove, 
  onReject, 
  showActions = false,
}: LeaveListProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const getStatusColor = (status: LeaveStatus) => {
    switch (status) {
      case LeaveStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case LeaveStatus.APPROVED:
        return 'bg-green-100 text-green-800';
      case LeaveStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      case LeaveStatus.CANCELLED:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW');
  };

  const handleReject = (id: string) => {
    const confirmed = confirm("確認是否要銷假？");
    if (confirmed) {
      fetch(`/api/leave/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: '已取消',
          rejectionReason: '自己銷假',
        }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            alert('已成功銷假');
            // 可根據需要刷新列表
            window.location.reload();
          } else {
            alert('銷假失敗: ' + data.message);
          }
        })
        .catch(err => {
          alert('銷假失敗: ' + err);
        });
    }
  };


  if (applications.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {t('noInfo')}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-4 text-red-600 font-semibold text-xs mb-6 text-center">{t('leaveApplyList.dataalive')}</div>

      {applications.map((application) => (
        <div key={application.id} className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {application.employeeName} ({application.employeeId})
              </h3>
              <p className="text-sm text-gray-600">
                {t('leaveApplyList.applyTime')}: {formatDate(application.appliedAt)}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
              {application.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">{t('leaveApplyList.leaveType')}</p>
              <p className="font-medium">{application.leaveType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('leaveApplyList.leavePeriod')}</p>
              <p className="font-medium">
                {formatDate(application.startDate)} - {formatDate(application.endDate)}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="mb-4">
              <p className="text-sm text-gray-600">{t('leaveApplyList.leaveReason')}</p>
              <p className="text-gray-800">{application.reason}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600">{t('leaveApplyList.proveLink')}</p>
                <a
                href={application.applyFolderLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-words pr-20"
                >
                {application.applyFolderLink}
                </a>
            </div>
          </div>
          
          {application.status === LeaveStatus.PENDING && (
            <button
              className="bg-red-500 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded w-full"
              onClick={() => { handleReject(application.id); }}
              disabled={user?.employeeId !== application.employeeId}
            >
              {t('cancel')}
            </button>
          )}
            
          

          {application.status === LeaveStatus.APPROVED && application.approvedAt && (
            <div className="mb-4 p-3 bg-green-50 rounded-md">
              <p className="text-sm text-green-800">
                {t('leaveApplyList.approvedAt')}: {formatDate(application.approvedAt)}
                {application.approvedBy && ` | ${t('leaveApplyList.approvedBy')}: ${application.employeeName}`}
              </p>
            </div>
          )}

          {application.status === LeaveStatus.REJECTED && application.rejectedAt && (
            <div className="mb-4 p-3 bg-red-50 rounded-md">
              <p className="text-sm text-red-800">
                拒絕時間: {formatDate(application.rejectedAt)}
                {application.rejectedBy && ` | 拒絕人員: ${application.rejectedBy}`}
              </p>
              {application.rejectionReason && (
                <p className="text-sm text-red-700 mt-1">
                  拒絕原因: {application.rejectionReason}
                </p>
              )}
            </div>
          )}

          {/* {showActions && application.status === LeaveStatus.PENDING && (
            <div className="flex space-x-2 pt-4 border-t">
              {onApprove && (
                <button
                  onClick={() => onApprove(application.id)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition duration-200"
                >
                  {t('approve')}
                </button>
              )}
              {onReject && (
                <button
                  onClick={() => handleReject(application.id)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition duration-200"
                >
                  {t('reject')} 
                </button>
              )}
            </div>
          )} */}

          {/* {showActions && onDelete && (
            <div className="flex justify-end pt-2">
              <button
                onClick={() => onDelete(application.id)}
                className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded-md text-xs font-medium transition duration-200"
              >
                刪除
              </button>
            </div>
          )} */}
        </div>
      ))}
    </div>
  );
}
