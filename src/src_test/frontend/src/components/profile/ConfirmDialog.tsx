import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  message: string;
  onClose: (confirmed: boolean) => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ open, message, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={() => onClose(false)}
      sx={{
        '& .MuiDialog-paper': {
          zIndex: 1301, // Đảm bảo dialog được hiển thị trên cùng
        },
      }}
    >
      <DialogTitle>Xác Nhận</DialogTitle>
      <DialogContent>
        <p>{message}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)} color="secondary">
          Hủy
        </Button>
        <Button onClick={() => onClose(true)} color="primary">
          Xác Nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
