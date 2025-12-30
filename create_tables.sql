-- 創建請假申請表格
CREATE TABLE IF NOT EXISTS leave_applications (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(10) NOT NULL,
    employee_name VARCHAR(100) NOT NULL,
    leave_type VARCHAR(50) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT '待審核',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP,
    approved_by VARCHAR(10),
    rejected_at TIMESTAMP,
    rejected_by VARCHAR(10),
    rejection_reason TEXT,
    apply_folder_link TEXT,
    authposition JSONB NOT NULL,
    positionarea JSONB NOT NULL,
    RandomUniqueId VARCHAR(255) UNIQUE NOT NULL
);

-- 創建索引以提高查詢效能
CREATE
INDEX IF NOT EXISTS idx_leave_applications_employee_id ON leave_applications (employee_id);

CREATE
INDEX IF NOT EXISTS idx_leave_applications_status ON leave_applications (status);

CREATE
INDEX IF NOT EXISTS idx_leave_applications_applied_at ON leave_applications (applied_at);

CREATE
INDEX IF NOT EXISTS idx_leave_applications_random_unique_id ON leave_applications (RandomUniqueId);