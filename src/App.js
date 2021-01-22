import React from 'react';
import Modal from "react-responsive-modal";
import 'react-responsive-modal/styles.css';
import "./modal.css";
import Form from "./form";

function App() {
  return (
      <Modal open={true}
             onClose={() => {}}
             classNames={{
                 modal: "modal-window",
                 closeButton: "modal-close-button",
                 closeIcon: "modal-close-icon"
             }}
             center>

          <Form/>

      </Modal>
  );
}

export default App;
