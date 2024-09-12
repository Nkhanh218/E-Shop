import React from "react";
import { Modal } from "antd";

const ModalCat = ({ isOpen, onClose, children }) => {
  return (
    <Modal
      title="Cập nhật thể loại"
      open={isOpen}
      onCancel={onClose}
      footer={null}
    >
      {children}
    </Modal>
  );
};

export default ModalCat;
