import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

import { useStoreActions, useStoreState } from "../store";

export const CreateProjectModal = () => {
  const modalName = "create-project";

  const [name, setName] = useState("");
  const [awaitingCreate, setAwaitingCreate] = useState(false);

  const isShowing = useStoreState((state) =>
    state.modals.isShowing.get(modalName)
  );
  const { hide, create } = useStoreActions((actions) => ({
    hide: actions.modals.hide,
    create: actions.projectCollection.createNewProject,
  }));

  const handleCreate = async () => {
    console.log("creating project", name);
    setAwaitingCreate(true);
    await create(name);
    setAwaitingCreate(false);
    handleClose();
  };

  const handleChange = (evt: any) => {
    setName(evt.target.value);
  };
  const handleClose = () => {
    setName(""); // Ready for next time
    hide(modalName);
  };

  const handleKeyPress: React.KeyboardEventHandler = (evt) => {
    if (evt.key === "Enter") {
      evt.preventDefault();
      if (name !== "") handleCreate();
    }
  };
  const inputRef: React.RefObject<HTMLInputElement> = React.createRef();
  useEffect(() => {
    if (isShowing) inputRef.current!.focus();
  });
  return (
    <Modal show={isShowing} onHide={handleClose} animation={false}>
      <Modal.Header closeButton={!awaitingCreate}>
        <Modal.Title>Create a new project</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Control
              readOnly={awaitingCreate}
              type="text"
              value={name}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              placeholder="Name for your new project"
              tabIndex={-1}
              ref={inputRef}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleClose}
          disabled={awaitingCreate}
        >
          Cancel
        </Button>
        <Button disabled={name === ""} variant="primary" onClick={handleCreate}>
          Create project
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateProjectModal;
