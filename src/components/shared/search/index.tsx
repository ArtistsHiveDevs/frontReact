import { useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import "./search.scss";

export const SearchComponent = ({
  handleSearch,
}: {
  handleSearch: () => void;
}) => {
  const [text, setText] = useState("");

  const handleText = (event: any) => {
    setText(event.target.value);
  };

  return (
    <div className="ah-nav-search">
      <InputGroup className="mb-3">
        <Form.Control
          aria-describedby="basic-addon2"
          aria-label="Artistas, bandas, lugares..."
          name="search"
          placeholder="Artistas, bandas, lugares..."
          value={text}
          onChange={handleText}
        />
        <Button
          id="button-addon2"
          variant="outline-secondary"
          onClick={() => handleSearch()}
        >
          Buscar
        </Button>
      </InputGroup>
    </div>
  );
};
