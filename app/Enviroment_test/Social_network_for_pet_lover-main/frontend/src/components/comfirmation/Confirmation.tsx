import { Box, Button, Modal, Typography } from '@mui/material';
import React from 'react'

interface DeleteConfirmationModalProps {
    open: boolean;
    title:string;
    message:string;
    onClose: () => void;
    onConfirm: () => void;
  }

const Confirmation:React.FC<DeleteConfirmationModalProps> = ({open,title,
    onClose,
    message,
    onConfirm}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: "8px",
          boxShadow: 24,
          p: 4,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          {title}
        </Typography>
        <Typography sx={{ mb: 3 }}>
          {message}
        </Typography>
        <div>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{ mr: 2 }}
          >
            Không
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Xóa
          </Button>
        </div>
      </Box>
    </Modal>
  )
}

export default Confirmation
