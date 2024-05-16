import React, { useEffect, useState } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import Swal from 'sweetalert2';

export default function EditUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(""); // To store the URL of the selected image
  const [validationError, setValidationError] = useState({});

  useEffect(() => {
    fetchProduct(); // eslint-disable-next-line 
  }, []);

  const fetchProduct = async () => {
    await axios.get(`http://localhost:8000/api/products/${id}`)
      .then(({ data }) => {
        const { title, description } = data.product;
        setTitle(title);
        setDescription(description);
        setImageUrl(`http://localhost:8000/storage/product/image/${data.product.image}`);
      })
      .catch(({ response: { data } }) => {
        Swal.fire({
          text: data.message,
          icon: "error"
        });
      });
  };

  const changeHandler = (event) => {
    setImage(event.target.files[0]);
    setImageUrl(URL.createObjectURL(event.target.files[0])); // Set the image URL
  };

  const updateProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('_method', 'PATCH');
    formData.append('title', title);
    formData.append('description', description);
    if (image !== null) {
      formData.append('image', image);
    }

    await axios.post(`http://localhost:8000/api/products/${id}`, formData)
      .then(({ data }) => {
        Swal.fire({
          icon: "success",
          text: data.message
        });
        navigate("/");
      })
      .catch(({ response }) => {
        if (response.status === 422) {
          setValidationError(response.data.errors);
        } else {
          Swal.fire({
            text: response.data.message,
            icon: "error"
          });
        }
      });
  };

  return (
    <div className="container">
      <Button variant="secondary" className="mt-2 me-2" size="lg" block="block" onClick={() => window.history.back()}>
      Back
      </Button>
      <div className="row justify-content-center">
        <div className="col-12 col-sm-12 col-md-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Update Post</h4>
              <hr />
              <div className="form-wrapper">
                {Object.keys(validationError).length > 0 && (
                  <div className="row">
                    <div className="col-12">
                      <div className="alert alert-danger">
                        <ul className="mb-0">
                          {Object.entries(validationError).map(([key, value]) => (
                            <li key={key}>{value}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                <Form onSubmit={updateProduct}>
                  <Row>
                    <Col>
                      <Form.Group controlId="Name">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" value={title} onChange={(event) => setTitle(event.target.value)} />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="my-3">
                    <Col>
                      <Form.Group controlId="Description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={3} value={description} onChange={(event) => setDescription(event.target.value)} />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group controlId="Image" className="mb-3">
                        <Form.Label>Image</Form.Label>
                        <Form.Control type="file" onChange={changeHandler} />
                      </Form.Group>
                    </Col>
                  </Row>
                  {imageUrl && ( // Render image if imageUrl exists
                    <Row className="mb-3">
                      <Col>
                        <img src={imageUrl} alt="Selected" style={{ maxWidth: "100%", height: "auto" }} />
                      </Col>
                    </Row>
                  )}
                  <Button variant="primary" className="mt-2" size="lg" block="block" type="submit">
                    Update
                  </Button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

