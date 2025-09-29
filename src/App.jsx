import { useState, useEffect, useCallback } from "react";
import "./App.css";

const generateId = () => Math.random().toString(36).substr(2, 9);

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
  });
};

const sortByDate = (items, field = "startDate") => {
  return [...items].sort((a, b) => new Date(b[field]) - new Date(a[field]));
};

const filterByKeyword = (items, keyword, fields = ["title", "description"]) => {
  if (!keyword) return items;
  return items.filter((item) =>
    fields.some((field) =>
      item[field]?.toLowerCase().includes(keyword.toLowerCase())
    )
  );
};

// Función async para simular guardado de datos
const saveDataToLocalStorage = async (key, data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.setItem(key, JSON.stringify(data));
      resolve(data);
    }, 500);
  });
};

// Función async para cargar datos
const loadDataFromLocalStorage = async (key, defaultValue = []) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = localStorage.getItem(key);
      resolve(data ? JSON.parse(data) : defaultValue);
    }, 300);
  });
};

// Componente Header
const Header = ({ personalInfo, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(personalInfo);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({ ...prev, photo: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    await saveDataToLocalStorage("personalInfo", formData);
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(personalInfo);
    setIsEditing(false);
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex align-items-center">
            {personalInfo.photo && (
              <img
                src={personalInfo.photo}
                alt="Foto de perfil"
                className="profile-photo me-3"
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid #007bff",
                }}
              />
            )}
            <h1 className="display-4 fw-bold text-white mb-0">
              {personalInfo.name}
            </h1>
          </div>
          <button
            className="btn btn-edit"
            onClick={() => setIsEditing(!isEditing)}
          >
            <i className="bi bi-pencil"></i> {isEditing ? "Cancelar" : "Editar"}
          </button>
        </div>

        {isEditing ? (
          <div className="row">
            <div className="col-12 mb-3">
              <label className="form-label">Foto de Perfil</label>
              <div className="d-flex align-items-center">
                {formData.photo && (
                  <img
                    src={formData.photo}
                    alt="Vista previa"
                    className="me-3"
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid #007bff",
                    }}
                  />
                )}
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Nombre Completo</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">País</label>
              <input
                type="text"
                className="form-control"
                value={formData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
              />
            </div>
            <div className="col-12 mb-3">
              <label className="form-label">Sitio Web</label>
              <input
                type="url"
                className="form-control"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
              />
            </div>
            <div className="col-12">
              <button className="btn btn-edit me-2" onClick={handleSave}>
                <i className="bi bi-check"></i> Guardar
              </button>
              <button className="btn btn-secondary" onClick={handleCancel}>
                <i className="bi bi-x"></i> Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-muted mb-1">{personalInfo.country}</p>
            <a
              href={personalInfo.website}
              className="contact-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="bi bi-globe me-1"></i>
              {personalInfo.website}
              <i className="bi bi-arrow-up-right-square ms-1"></i>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente About
const About = ({ about, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(about);

  const handleSave = async () => {
    await saveDataToLocalStorage("about", description);
    onUpdate(description);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDescription(about);
    setIsEditing(false);
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="section-title mb-0">Acerca de</h2>
          <button
            className="btn btn-edit"
            onClick={() => setIsEditing(!isEditing)}
          >
            <i className="bi bi-pencil"></i> {isEditing ? "Cancelar" : "Editar"}
          </button>
        </div>

        {isEditing ? (
          <div>
            <textarea
              className="form-control"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe tu experiencia profesional y objetivos..."
            />
            <div className="mt-3">
              <button className="btn btn-edit me-2" onClick={handleSave}>
                <i className="bi bi-check"></i> Guardar
              </button>
              <button className="btn btn-secondary" onClick={handleCancel}>
                <i className="bi bi-x"></i> Cancelar
              </button>
            </div>
          </div>
        ) : (
          <p className="text-muted">{description}</p>
        )}
      </div>
    </div>
  );
};

// Componente Education
const Education = ({ education, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [items, setItems] = useState(education);
  const [newItem, setNewItem] = useState({
    title: "",
    institution: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const handleAddItem = () => {
    const item = { ...newItem, id: generateId() };
    const updatedItems = [...items, item];
    setItems(updatedItems);
    setNewItem({
      title: "",
      institution: "",
      startDate: "",
      endDate: "",
      description: "",
    });
  };

  const handleDeleteItem = (id) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
  };

  const handleSave = async () => {
    await saveDataToLocalStorage("education", items);
    onUpdate(items);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setItems(education);
    setIsEditing(false);
  };

  const sortedEducation = sortByDate(items, "startDate");

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="section-title mb-0">Educación</h2>
          <button
            className="btn btn-edit"
            onClick={() => setIsEditing(!isEditing)}
          >
            <i className="bi bi-pencil"></i> {isEditing ? "Cancelar" : "Editar"}
          </button>
        </div>

        {isEditing ? (
          <div>
            <div className="row mb-3">
              <div className="col-md-6 mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Título o grado"
                  value={newItem.title}
                  onChange={(e) =>
                    setNewItem({ ...newItem, title: e.target.value })
                  }
                />
              </div>
              <div className="col-md-6 mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Institución"
                  value={newItem.institution}
                  onChange={(e) =>
                    setNewItem({ ...newItem, institution: e.target.value })
                  }
                />
              </div>
              <div className="col-md-6 mb-2">
                <input
                  type="date"
                  className="form-control"
                  placeholder="Fecha de inicio"
                  value={newItem.startDate}
                  onChange={(e) =>
                    setNewItem({ ...newItem, startDate: e.target.value })
                  }
                />
              </div>
              <div className="col-md-6 mb-2">
                <input
                  type="date"
                  className="form-control"
                  placeholder="Fecha de fin"
                  value={newItem.endDate}
                  onChange={(e) =>
                    setNewItem({ ...newItem, endDate: e.target.value })
                  }
                />
              </div>
              <div className="col-12 mb-2">
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="Descripción"
                  value={newItem.description}
                  onChange={(e) =>
                    setNewItem({ ...newItem, description: e.target.value })
                  }
                />
              </div>
              <div className="col-12">
                <button className="btn btn-edit me-2" onClick={handleAddItem}>
                  <i className="bi bi-plus"></i> Agregar
                </button>
              </div>
            </div>

            {items.map((item, index) => (
              <div
                key={item.id}
                className="timeline-item mb-3 p-3 bg-dark rounded"
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    <h5 className="text-white">{item.title}</h5>
                    <p className="text-muted mb-1">{item.institution}</p>
                    <small className="text-muted">
                      {formatDate(item.startDate)} -{" "}
                      {item.endDate ? formatDate(item.endDate) : "Presente"}
                    </small>
                    {item.description && (
                      <p className="mt-2 text-muted">{item.description}</p>
                    )}
                  </div>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            ))}

            <div className="mt-3">
              <button className="btn btn-edit me-2" onClick={handleSave}>
                <i className="bi bi-check"></i> Guardar
              </button>
              <button className="btn btn-secondary" onClick={handleCancel}>
                <i className="bi bi-x"></i> Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div>
            {sortedEducation.map((item, index) => (
              <div key={item.id} className="timeline-item">
                <h5 className="text-white">{item.title}</h5>
                <p className="text-muted mb-1">{item.institution}</p>
                <small className="text-muted">
                  {formatDate(item.startDate)} -{" "}
                  {item.endDate ? formatDate(item.endDate) : "Presente"}
                </small>
                {item.description && (
                  <p className="mt-2 text-muted">{item.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Componente Projects
const Projects = ({ projects, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [items, setItems] = useState(projects);
  const [searchTerm, setSearchTerm] = useState("");
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    technologies: "",
    url: "",
    startDate: "",
  });

  const handleAddItem = () => {
    const item = { ...newItem, id: generateId() };
    const updatedItems = [...items, item];
    setItems(updatedItems);
    setNewItem({
      title: "",
      description: "",
      technologies: "",
      url: "",
      startDate: "",
    });
  };

  const handleDeleteItem = (id) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
  };

  const handleSave = async () => {
    await saveDataToLocalStorage("projects", items);
    onUpdate(items);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setItems(projects);
    setIsEditing(false);
  };

  const filteredProjects = filterByKeyword(
    sortByDate(items, "startDate"),
    searchTerm
  );

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="section-title mb-0">Proyectos</h2>
          <button
            className="btn btn-edit"
            onClick={() => setIsEditing(!isEditing)}
          >
            <i className="bi bi-pencil"></i> {isEditing ? "Cancelar" : "Editar"}
          </button>
        </div>

        {isEditing ? (
          <div>
            <div className="row mb-3">
              <div className="col-md-6 mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Título del proyecto"
                  value={newItem.title}
                  onChange={(e) =>
                    setNewItem({ ...newItem, title: e.target.value })
                  }
                />
              </div>
              <div className="col-md-6 mb-2">
                <input
                  type="url"
                  className="form-control"
                  placeholder="URL del proyecto"
                  value={newItem.url}
                  onChange={(e) =>
                    setNewItem({ ...newItem, url: e.target.value })
                  }
                />
              </div>
              <div className="col-md-6 mb-2">
                <input
                  type="date"
                  className="form-control"
                  placeholder="Fecha de inicio"
                  value={newItem.startDate}
                  onChange={(e) =>
                    setNewItem({ ...newItem, startDate: e.target.value })
                  }
                />
              </div>
              <div className="col-md-6 mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tecnologías (separadas por comas)"
                  value={newItem.technologies}
                  onChange={(e) =>
                    setNewItem({ ...newItem, technologies: e.target.value })
                  }
                />
              </div>
              <div className="col-12 mb-2">
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Descripción del proyecto"
                  value={newItem.description}
                  onChange={(e) =>
                    setNewItem({ ...newItem, description: e.target.value })
                  }
                />
              </div>
              <div className="col-12">
                <button className="btn btn-edit me-2" onClick={handleAddItem}>
                  <i className="bi bi-plus"></i> Agregar
                </button>
              </div>
            </div>

            {items.map((item, index) => (
              <div
                key={item.id}
                className="timeline-item mb-3 p-3 bg-dark rounded"
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center mb-2">
                      <h5 className="text-white mb-0">{item.title}</h5>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ms-2 contact-link"
                        >
                          <i className="bi bi-arrow-up-right-square"></i>
                        </a>
                      )}
                    </div>
                    <p className="text-muted mb-1">{item.description}</p>
                    {item.technologies && (
                      <div className="mb-2">
                        {item.technologies.split(",").map((tech, idx) => (
                          <span key={idx} className="skill-badge me-1">
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                    <small className="text-muted">
                      {item.startDate && formatDate(item.startDate)}
                    </small>
                  </div>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            ))}

            <div className="mt-3">
              <button className="btn btn-edit me-2" onClick={handleSave}>
                <i className="bi bi-check"></i> Guardar
              </button>
              <button className="btn btn-secondary" onClick={handleCancel}>
                <i className="bi bi-x"></i> Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar proyectos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {filteredProjects.map((item, index) => (
              <div key={item.id} className="timeline-item">
                <div className="d-flex align-items-center mb-2">
                  <h5 className="text-white mb-0">{item.title}</h5>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ms-2 contact-link"
                    >
                      <i className="bi bi-arrow-up-right-square"></i>
                    </a>
                  )}
                </div>
                <p className="text-muted mb-2">{item.description}</p>
                {item.technologies && (
                  <div className="mb-2">
                    {item.technologies.split(",").map((tech, idx) => (
                      <span key={idx} className="skill-badge me-1">
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                )}
                <small className="text-muted">
                  {item.startDate && formatDate(item.startDate)}
                </small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Componente Skills
const Skills = ({ skills, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [items, setItems] = useState(skills);
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    if (newSkill.trim() && !items.includes(newSkill.trim())) {
      const updatedItems = [...items, newSkill.trim()];
      setItems(updatedItems);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updatedItems = items.filter((skill) => skill !== skillToRemove);
    setItems(updatedItems);
  };

  const handleSave = async () => {
    await saveDataToLocalStorage("skills", items);
    onUpdate(items);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setItems(skills);
    setIsEditing(false);
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="section-title mb-0">Aplicaciones y Herramientas</h2>
          <button
            className="btn btn-edit"
            onClick={() => setIsEditing(!isEditing)}
          >
            <i className="bi bi-pencil"></i> {isEditing ? "Cancelar" : "Editar"}
          </button>
        </div>

        {isEditing ? (
          <div>
            <div className="d-flex mb-3">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Agregar nueva herramienta"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
              />
              <button className="btn btn-edit" onClick={handleAddSkill}>
                <i className="bi bi-plus"></i>
              </button>
            </div>

            <div className="mb-3">
              {items.map((skill, index) => (
                <span
                  key={index}
                  className="skill-badge me-2 mb-2 position-relative"
                >
                  {skill}
                  <button
                    className="btn btn-sm btn-outline-danger ms-2"
                    style={{ padding: "0.1rem 0.3rem", fontSize: "0.7rem" }}
                    onClick={() => handleRemoveSkill(skill)}
                  >
                    <i className="bi bi-x"></i>
                  </button>
                </span>
              ))}
            </div>

            <div>
              <button className="btn btn-edit me-2" onClick={handleSave}>
                <i className="bi bi-check"></i> Guardar
              </button>
              <button className="btn btn-secondary" onClick={handleCancel}>
                <i className="bi bi-x"></i> Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div>
            {items.map((skill, index) => (
              <span key={index} className="skill-badge">
                <i className="bi bi-tools me-1"></i>
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Componente Contact
const Contact = ({ contactInfo, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(contactInfo);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    await saveDataToLocalStorage("contactInfo", formData);
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(contactInfo);
    setIsEditing(false);
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="section-title mb-0">Contacto</h2>
          <button
            className="btn btn-edit"
            onClick={() => setIsEditing(!isEditing)}
          >
            <i className="bi bi-pencil"></i> {isEditing ? "Cancelar" : "Editar"}
          </button>
        </div>

        {isEditing ? (
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Sitio Web</label>
              <input
                type="url"
                className="form-control"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">CV Online</label>
              <input
                type="url"
                className="form-control"
                value={formData.onlineCv}
                onChange={(e) => handleInputChange("onlineCv", e.target.value)}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Teléfono</label>
              <input
                type="tel"
                className="form-control"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>
            <div className="col-12">
              <button className="btn btn-edit me-2" onClick={handleSave}>
                <i className="bi bi-check"></i> Guardar
              </button>
              <button className="btn btn-secondary" onClick={handleCancel}>
                <i className="bi bi-x"></i> Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="row">
            <div className="col-md-6 mb-3">
              <strong className="text-muted">Sitio Web</strong>
              <div>
                <a
                  href={formData.website}
                  className="contact-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {formData.website}
                  <i className="bi bi-arrow-up-right-square ms-1"></i>
                </a>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <strong className="text-muted">CV Online</strong>
              <div>
                <a
                  href={formData.onlineCv}
                  className="contact-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {formData.onlineCv}
                  <i className="bi bi-arrow-up-right-square ms-1"></i>
                </a>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <strong className="text-muted">Email</strong>
              <div>
                <a href={`mailto:${formData.email}`} className="contact-link">
                  {formData.email}
                </a>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <strong className="text-muted">Teléfono</strong>
              <div>
                <a href={`tel:${formData.phone}`} className="contact-link">
                  {formData.phone}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente principal App
const App = () => {
  const [personalInfo, setPersonalInfo] = useState({
    name: "Nombre",
    country: "País",
    website: "https://sitio.com",
    photo: null,
  });

  const [about, setAbout] = useState("////////");

  const [education, setEducation] = useState([
    {
      id: "1",
      title: "Ingeniería en Desarrollo y Gestion de Software",
      institution: "Universidad Tecnológica de Leon",
      startDate: "2022-09-01",
      endDate: "2026-05-01",
      description:
        "Especialización en desarrollo de software y arquitectura de sistemas.",
    },
  ]);

  const [projects, setProjects] = useState([
    {
      id: "1",
      title: "E-commerce Platform",
      description:
        "Plataforma completa de comercio electrónico con sistema de pagos integrado.",
      technologies: "React, Node.js, MongoDB, Stripe",
      url: "https://github.com/usuario/ecommerce",
      startDate: "2023-01-01",
    },
  ]);

  const [skills, setSkills] = useState([
    "React",
    "JavaScript",
    "Node.js",
    "Python",
    "Git",
    "Docker",
    "Figma",
    "Adobe XD",
    "VS Code",
    "MongoDB",
    "PostgreSQL",
  ]);

  const [contactInfo, setContactInfo] = useState({
    website: "https://www.ejemplo.com",
    onlineCv: "https://www.ejemplo.com/cv",
    email: "ejemplo@email.com",
    phone: "+1234567890",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);

  // Función para cargar datos al inicializar
  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [
        loadedPersonalInfo,
        loadedAbout,
        loadedEducation,
        loadedProjects,
        loadedSkills,
        loadedContactInfo,
      ] = await Promise.all([
        loadDataFromLocalStorage("personalInfo", personalInfo),
        loadDataFromLocalStorage("about", about),
        loadDataFromLocalStorage("education", education),
        loadDataFromLocalStorage("projects", projects),
        loadDataFromLocalStorage("skills", skills),
        loadDataFromLocalStorage("contactInfo", contactInfo),
      ]);

      setPersonalInfo(loadedPersonalInfo);
      setAbout(loadedAbout);
      setEducation(loadedEducation);
      setProjects(loadedProjects);
      setSkills(loadedSkills);
      setContactInfo(loadedContactInfo);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Función para actualizar timestamp de guardado
  const updateLastSaved = useCallback(() => {
    setLastSaved(new Date().toLocaleString("es-ES"));
  }, []);

  // Función para auto-guardar cada 30 segundos
  useEffect(() => {
    const autoSaveInterval = setInterval(async () => {
      if (!isLoading) {
        await Promise.all([
          saveDataToLocalStorage("personalInfo", personalInfo),
          saveDataToLocalStorage("about", about),
          saveDataToLocalStorage("education", education),
          saveDataToLocalStorage("projects", projects),
          saveDataToLocalStorage("skills", skills),
          saveDataToLocalStorage("contactInfo", contactInfo),
        ]);
        updateLastSaved();
      }
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [
    personalInfo,
    about,
    education,
    projects,
    skills,
    contactInfo,
    isLoading,
    updateLastSaved,
  ]);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="text-muted">Cargando tu CV...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cv-container">
      <div className="text-end mb-3">
        {lastSaved && (
          <small className="text-muted">
            <i className="bi bi-clock me-1"></i>
            Última actualización: {lastSaved}
          </small>
        )}
      </div>

      <Header
        personalInfo={personalInfo}
        onUpdate={(data) => {
          setPersonalInfo(data);
          updateLastSaved();
        }}
      />

      <About
        about={about}
        onUpdate={(data) => {
          setAbout(data);
          updateLastSaved();
        }}
      />

      <div className="row">
        <div className="col-lg-6">
          <Education
            education={education}
            onUpdate={(data) => {
              setEducation(data);
              updateLastSaved();
            }}
          />
        </div>
        <div className="col-lg-6">
          <Projects
            projects={projects}
            onUpdate={(data) => {
              setProjects(data);
              updateLastSaved();
            }}
          />
        </div>
      </div>

      <Skills
        skills={skills}
        onUpdate={(data) => {
          setSkills(data);
          updateLastSaved();
        }}
      />

      <Contact
        contactInfo={contactInfo}
        onUpdate={(data) => {
          setContactInfo(data);
          updateLastSaved();
        }}
      />
    </div>
  );
};

export default App;
