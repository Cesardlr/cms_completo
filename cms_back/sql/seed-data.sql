-- CMS Médico - Seed Data
-- Insert initial data for development/testing

-- Roles
INSERT INTO ROL (nombre) VALUES
  ('admin'),
  ('editor')
ON CONFLICT (nombre) DO NOTHING;

-- Especialidades
INSERT INTO ESPECIALIDAD (nombre) VALUES
  ('Cardiología'),
  ('Pediatría'),
  ('Dermatología'),
  ('Neurología'),
  ('Traumatología'),
  ('Medicina General'),
  ('Ginecología'),
  ('Oftalmología')
ON CONFLICT (nombre) DO NOTHING;

-- Tipos de Sangre
INSERT INTO TIPO_SANGRE (tipo) VALUES
  ('A+'), ('A-'), ('B+'), ('B-'),
  ('AB+'), ('AB-'), ('O+'), ('O-')
ON CONFLICT (tipo) DO NOTHING;

-- Ocupaciones
INSERT INTO OCUPACION (nombre) VALUES
  ('Médico'),
  ('Ingeniero'),
  ('Docente'),
  ('Estudiante'),
  ('Comerciante'),
  ('Empleado'),
  ('Independiente')
ON CONFLICT (nombre) DO NOTHING;

-- Estado Civil
INSERT INTO ESTADO_CIVIL (nombre) VALUES
  ('Soltero/a'),
  ('Casado/a'),
  ('Divorciado/a'),
  ('Viudo/a'),
  ('Unión Libre')
ON CONFLICT (nombre) DO NOTHING;

-- Estados de Cita
INSERT INTO ESTADO_CITA (nombre) VALUES
  ('Confirmada'),
  ('Pendiente'),
  ('Cancelada'),
  ('Completada'),
  ('En Espera')
ON CONFLICT (nombre) DO NOTHING;

-- Tipos de Cita
INSERT INTO TIPO_CITA (nombre) VALUES
  ('Consulta General'),
  ('Consulta Especializada'),
  ('Seguimiento'),
  ('Urgencia'),
  ('Revisión')
ON CONFLICT (nombre) DO NOTHING;

-- Estados de Consulta
INSERT INTO ESTADO_CONSULTA (nombre) VALUES
  ('En Proceso'),
  ('Completada'),
  ('Cancelada'),
  ('En Espera')
ON CONFLICT (nombre) DO NOTHING;

-- Estados de Código
INSERT INTO ESTADO_CODIGO (nombre) VALUES
  ('Activo'),
  ('Usado'),
  ('Expirado'),
  ('Cancelado')
ON CONFLICT (nombre) DO NOTHING;

-- Países
INSERT INTO PAIS (nombre) VALUES
  ('México'),
  ('Estados Unidos'),
  ('Canadá'),
  ('España'),
  ('Colombia')
ON CONFLICT (nombre) DO NOTHING;

-- Estados (México)
INSERT INTO ESTADO (nombre, pais_id) 
SELECT 'Nuevo León', id FROM PAIS WHERE nombre = 'México'
ON CONFLICT DO NOTHING;

INSERT INTO ESTADO (nombre, pais_id) 
SELECT 'Jalisco', id FROM PAIS WHERE nombre = 'México'
ON CONFLICT DO NOTHING;

INSERT INTO ESTADO (nombre, pais_id) 
SELECT 'Ciudad de México', id FROM PAIS WHERE nombre = 'México'
ON CONFLICT DO NOTHING;

-- Ciudades
INSERT INTO CIUDAD (nombre, estado_id)
SELECT 'Monterrey', id FROM ESTADO WHERE nombre = 'Nuevo León'
ON CONFLICT DO NOTHING;

INSERT INTO CIUDAD (nombre, estado_id)
SELECT 'San Pedro Garza García', id FROM ESTADO WHERE nombre = 'Nuevo León'
ON CONFLICT DO NOTHING;

INSERT INTO CIUDAD (nombre, estado_id)
SELECT 'Guadalajara', id FROM ESTADO WHERE nombre = 'Jalisco'
ON CONFLICT DO NOTHING;

-- Colonias
INSERT INTO COLONIA (nombre, codigo_postal, ciudad_id)
SELECT 'Centro', '64000', id FROM CIUDAD WHERE nombre = 'Monterrey'
ON CONFLICT DO NOTHING;

INSERT INTO COLONIA (nombre, codigo_postal, ciudad_id)
SELECT 'Del Valle', '66220', id FROM CIUDAD WHERE nombre = 'San Pedro Garza García'
ON CONFLICT DO NOTHING;

-- Usuarios de prueba (password: "password123" hashed with bcrypt)
-- Hash generado: $2a$10$YourHashHere
INSERT INTO USUARIO (username, correo, telefono, password_hash, rol_id)
SELECT 'admin', 'admin@cms.com', '555-0001', 
       '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', -- password: password123
       id FROM ROL WHERE nombre = 'admin'
ON CONFLICT (username) DO NOTHING;

INSERT INTO USUARIO (username, correo, telefono, password_hash, rol_id)
SELECT 'editor', 'editor@cms.com', '555-0002',
       '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', -- password: password123
       id FROM ROL WHERE nombre = 'editor'
ON CONFLICT (username) DO NOTHING;

-- Sample Clinic
INSERT INTO CLINICA (nombre, telefono, correo) VALUES
  ('Clínica Santa María', '555-3001', 'contacto@santamaria.com'),
  ('Centro Médico del Valle', '555-3002', 'info@medvalle.com')
ON CONFLICT DO NOTHING;

-- Sample Aseguradora
INSERT INTO ASEGURADORA (nombre, rfc, telefono, correo) VALUES
  ('Seguros Monterrey', 'SEG123456ABC', '555-4001', 'contacto@segurosmt.com'),
  ('Aseguradora del Norte', 'ASE789012DEF', '555-4002', 'info@asegnorte.com')
ON CONFLICT DO NOTHING;

COMMIT;

