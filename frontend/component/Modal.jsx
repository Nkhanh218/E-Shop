import React from "react";
import { Modal } from "antd";

const ModalCat = ({ isOpen, onClose, children }) => {
  return (
    <Modal
      title="Category Details"
      open={isOpen}
      onCancel={onClose}
      footer={null}
    >
      {children}
    </Modal>
  );
};

export default ModalCat;
