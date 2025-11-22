"""
Locust Load Testing File for CMS Medical API

Este archivo define escenarios de prueba de carga para la API CMS Medical.
Simula diferentes tipos de usuarios (Admin, Doctor, Patient) y sus comportamientos.

FLUJO DE EJECUCIÓN:
===================
1. PRIMERO: Cada usuario simulado genera un token de login en on_start()
2. LUEGO: Todas las tareas verifican que el token existe antes de ejecutarse
3. Todas las peticiones incluyen el token en el header Authorization

IMPORTANTE: Si el login falla, el usuario no realizará ninguna acción adicional.

Usage:
    locust -f locustfile.py --host=http://localhost:5000
    
    Or with custom parameters:
    locust -f locustfile.py --host=http://localhost:5000 --users=100 --spawn-rate=10 --run-time=5m
"""

from locust import HttpUser, task, between, events
import random
import json
from datetime import datetime, timedelta


class CMSUser(HttpUser):
    """
    Base class for CMS API users.
    Handles authentication and common behaviors.
    PRIMERO genera el token de login, LUEGO ejecuta todas las acciones.
    """
    wait_time = between(1, 3)  # Wait 1-3 seconds between tasks
    
    def on_start(self):
        """
        PRIMERO: Genera el token de login antes de hacer cualquier movimiento.
        Este método se ejecuta automáticamente cuando un usuario simulado inicia.
        """
        self.token = None
        self.user_id = None
        self.username = None
        self.login_successful = False
        
        # PASO 1: PRIMERO - Generar token de login
        login_data = {
            "username": "admin",
            "password": "password"
        }
        
        with self.client.post(
            "/api/auth/login",
            json=login_data,
            catch_response=True,
            name="[1] PRIMERO - Login - Generar Token"
        ) as response:
            if response.status_code == 200:
                try:
                    data = response.json()
                    self.token = data.get("token")
                    self.user_id = data.get("user", {}).get("id")
                    self.username = data.get("user", {}).get("username")
                    
                    if self.token:
                        self.login_successful = True
                        # Token generado exitosamente - ahora puede hacer todas las acciones
                        response.success()
                    else:
                        response.failure("Token no recibido en respuesta")
                        self.login_successful = False
                except Exception as e:
                    response.failure(f"Error al procesar respuesta: {e}")
                    self.login_successful = False
            else:
                error_msg = f"Login falló con código {response.status_code}"
                response.failure(error_msg)
                self.login_successful = False
                self.token = None
        
        # Si el login falló, este usuario no realizará acciones (todas las tareas verifican is_authenticated())
    
    def get_headers(self):
        """
        Obtiene los headers con el token de autenticación.
        Todas las peticiones deben usar este método para incluir el token.
        """
        if self.token:
            return {
                "Authorization": f"Bearer {self.token}",
                "Content-Type": "application/json"
            }
        return {"Content-Type": "application/json"}
    
    def is_authenticated(self):
        """
        Verifica si el usuario está autenticado (tiene token válido).
        Todas las tareas deben verificar esto antes de ejecutarse.
        """
        return self.login_successful and self.token is not None
    
    @task(3)
    def get_current_user(self):
        """
        LUEGO: Obtener información del usuario actual.
        Solo se ejecuta si el token fue generado exitosamente.
        """
        if not self.is_authenticated():
            return
        
        self.client.get(
            "/api/auth/me",
            headers=self.get_headers(),
            name="[2] Get Current User"
        )
    
    @task(2)
    def health_check(self):
        """Check API health (no auth required - puede ejecutarse sin token)."""
        self.client.get("/health", name="Health Check")
    
    @task(1)
    def health_database(self):
        """Check database health (no auth required - puede ejecutarse sin token)."""
        self.client.get("/health/database", name="Health Database")


class AdminUser(CMSUser):
    """
    Simulates an Admin user with full access to all endpoints.
    """
    weight = 1  # 10% of users are admins
    
    @task(5)
    def list_users(self):
        """LUEGO: Listar todos los usuarios (requiere token)."""
        if not self.is_authenticated():
            return
        
        params = {
            "limit": random.randint(10, 50),
            "offset": 0,
            "search": random.choice(["", "admin", "doctor", "patient"])
        }
        
        self.client.get(
            "/api/users",
            headers=self.get_headers(),
            params=params,
            name="List Users"
        )
    
    @task(3)
    def get_user_by_id(self):
        """LUEGO: Obtener usuario por ID (requiere token)."""
        if not self.is_authenticated():
            return
        
        user_id = random.randint(1, 100)
        self.client.get(
            f"/api/users/{user_id}",
            headers=self.get_headers(),
            name="Get User by ID"
        )
    
    @task(2)
    def list_patients(self):
        """LUEGO: Listar pacientes (requiere token)."""
        if not self.is_authenticated():
            return
        
        params = {
            "limit": random.randint(10, 50),
            "offset": 0,
            "search": random.choice(["", "juan", "maria", "pedro"])
        }
        
        self.client.get(
            "/api/patients",
            headers=self.get_headers(),
            params=params,
            name="List Patients"
        )
    
    @task(2)
    def list_doctors(self):
        """LUEGO: Listar doctores (requiere token)."""
        if not self.is_authenticated():
            return
        
        params = {
            "limit": random.randint(10, 50),
            "offset": 0,
            "search": random.choice(["", "garcia", "lopez", "martinez"])
        }
        
        self.client.get(
            "/api/doctors",
            headers=self.get_headers(),
            params=params,
            name="List Doctors"
        )
    
    @task(4)
    def get_dashboard_kpis(self):
        """LUEGO: Obtener KPIs del dashboard (requiere token)."""
        if not self.is_authenticated():
            return
        
        self.client.get(
            "/api/dashboard/kpis",
            headers=self.get_headers(),
            name="Dashboard KPIs"
        )
    
    @task(3)
    def get_dashboard_charts(self):
        """LUEGO: Obtener gráficas del dashboard (requiere token)."""
        if not self.is_authenticated():
            return
        
        self.client.get(
            "/api/dashboard/charts",
            headers=self.get_headers(),
            name="Dashboard Charts"
        )
    
    @task(2)
    def list_appointments(self):
        """LUEGO: Listar citas con filtros (requiere token)."""
        if not self.is_authenticated():
            return
        
        # Random date range (last 30 days)
        fecha_desde = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")
        fecha_hasta = datetime.now().strftime("%Y-%m-%d")
        
        params = {
            "fecha_desde": fecha_desde,
            "fecha_hasta": fecha_hasta,
            "medico_id": random.choice([None, 1, 2, 3])
        }
        
        # Remove None values
        params = {k: v for k, v in params.items() if v is not None}
        
        self.client.get(
            "/api/appointments/citas",
            headers=self.get_headers(),
            params=params,
            name="List Appointments"
        )
    
    @task(2)
    def list_audit_logs(self):
        """LUEGO: Listar logs de auditoría (requiere token)."""
        if not self.is_authenticated():
            return
        
        params = {
            "limit": random.randint(20, 50),
            "offset": 0,
            "entidad": random.choice([None, "USUARIO", "CITA", "PACIENTE"]),
            "accion": random.choice([None, "CREATE", "UPDATE", "DELETE"])
        }
        
        # Remove None values
        params = {k: v for k, v in params.items() if v is not None}
        
        self.client.get(
            "/api/audit",
            headers=self.get_headers(),
            params=params,
            name="List Audit Logs"
        )
    
    @task(1)
    def get_audit_stats(self):
        """LUEGO: Obtener estadísticas de auditoría (requiere token)."""
        if not self.is_authenticated():
            return
        
        self.client.get(
            "/api/audit/stats",
            headers=self.get_headers(),
            name="Audit Stats"
        )
    
    @task(2)
    def list_catalogs(self):
        """LUEGO: Listar catálogos (requiere token)."""
        if not self.is_authenticated():
            return
        
        catalogs = [
            "especialidades",
            "tipos-sangre",
            "ocupaciones",
            "estado-civil",
            "estado-cita",
            "tipo-cita",
            "estado-consulta",
            "estado-codigo"
        ]
        
        catalog = random.choice(catalogs)
        params = {
            "limit": random.randint(10, 50),
            "offset": 0
        }
        
        self.client.get(
            f"/api/catalogs/{catalog}",
            headers=self.get_headers(),
            params=params,
            name=f"List Catalog - {catalog}"
        )
    
    @task(1)
    def list_files(self):
        """LUEGO: Listar archivos (requiere token)."""
        if not self.is_authenticated():
            return
        
        params = {
            "limit": random.randint(10, 50),
            "offset": 0,
            "search": random.choice(["", "pdf", "image", "xray"])
        }
        
        self.client.get(
            "/api/files",
            headers=self.get_headers(),
            params=params,
            name="List Files"
        )
    
    @task(1)
    def list_insurance_companies(self):
        """LUEGO: Listar aseguradoras (requiere token)."""
        if not self.is_authenticated():
            return
        
        params = {
            "search": random.choice(["", "seguros", "insurance"])
        }
        
        self.client.get(
            "/api/insurance/companies",
            headers=self.get_headers(),
            params=params,
            name="List Insurance Companies"
        )
    
    @task(1)
    def list_notifications(self):
        """LUEGO: Listar notificaciones (requiere token)."""
        if not self.is_authenticated():
            return
        
        params = {
            "limit": random.randint(10, 50),
            "offset": 0
        }
        
        self.client.get(
            "/api/notifications",
            headers=self.get_headers(),
            params=params,
            name="List Notifications"
        )


class DoctorUser(CMSUser):
    """
    Simulates a Doctor user focusing on appointments and patient management.
    """
    weight = 3  # 30% of users are doctors
    
    def on_start(self):
        """Doctor-specific initialization."""
        super().on_start()
        self.doctor_id = random.randint(1, 10)
        self.patient_ids = list(range(1, 50))
    
    @task(6)
    def list_my_appointments(self):
        """LUEGO: Listar mis citas como doctor (requiere token)."""
        if not self.is_authenticated():
            return
        
        fecha_desde = (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d")
        fecha_hasta = (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%d")
        
        params = {
            "fecha_desde": fecha_desde,
            "fecha_hasta": fecha_hasta,
            "medico_id": self.doctor_id
        }
        
        self.client.get(
            "/api/appointments/citas",
            headers=self.get_headers(),
            params=params,
            name="List My Appointments"
        )
    
    @task(5)
    def list_consultations(self):
        """LUEGO: Listar consultas (requiere token)."""
        if not self.is_authenticated():
            return
        
        patient_id = random.choice(self.patient_ids)
        params = {
            "paciente_id": patient_id,
            "limit": random.randint(10, 30)
        }
        
        self.client.get(
            "/api/appointments/consultas",
            headers=self.get_headers(),
            params=params,
            name="List Consultations"
        )
    
    @task(4)
    def get_patient_info(self):
        """LUEGO: Obtener información del paciente (requiere token)."""
        if not self.is_authenticated():
            return
        
        patient_id = random.choice(self.patient_ids)
        self.client.get(
            f"/api/patients/{patient_id}",
            headers=self.get_headers(),
            name="Get Patient Info"
        )
    
    @task(3)
    def list_patient_episodes(self):
        """LUEGO: Listar episodios del paciente (requiere token)."""
        if not self.is_authenticated():
            return
        
        patient_id = random.choice(self.patient_ids)
        params = {
            "paciente_id": patient_id
        }
        
        self.client.get(
            "/api/appointments/episodios",
            headers=self.get_headers(),
            params=params,
            name="List Patient Episodes"
        )
    
    @task(2)
    def get_specialties(self):
        """LUEGO: Obtener catálogo de especialidades (requiere token)."""
        if not self.is_authenticated():
            return
        
        self.client.get(
            "/api/catalogs/especialidades",
            headers=self.get_headers(),
            name="Get Specialties"
        )
    
    @task(2)
    def list_files_for_patient(self):
        """LUEGO: Listar archivos asociados al paciente (requiere token)."""
        if not self.is_authenticated():
            return
        
        archivo_id = random.randint(1, 100)
        params = {
            "archivo_id": archivo_id
        }
        
        self.client.get(
            "/api/files/associations",
            headers=self.get_headers(),
            params=params,
            name="List File Associations"
        )
    
    @task(1)
    def get_dashboard_kpis(self):
        """LUEGO: Obtener KPIs del dashboard (requiere token)."""
        if not self.is_authenticated():
            return
        
        self.client.get(
            "/api/dashboard/kpis",
            headers=self.get_headers(),
            name="Dashboard KPIs"
        )


class PatientUser(CMSUser):
    """
    Simulates a Patient user with limited access.
    """
    weight = 6  # 60% of users are patients
    
    def on_start(self):
        """Patient-specific initialization."""
        super().on_start()
        self.patient_id = random.randint(1, 50)
    
    @task(5)
    def get_my_appointments(self):
        """LUEGO: Obtener mis citas como paciente (requiere token)."""
        if not self.is_authenticated():
            return
        
        fecha_desde = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")
        fecha_hasta = (datetime.now() + timedelta(days=60)).strftime("%Y-%m-%d")
        
        params = {
            "fecha_desde": fecha_desde,
            "fecha_hasta": fecha_hasta,
            "paciente_id": self.patient_id
        }
        
        self.client.get(
            "/api/appointments/citas",
            headers=self.get_headers(),
            params=params,
            name="Get My Appointments"
        )
    
    @task(4)
    def get_my_consultations(self):
        """LUEGO: Obtener mis consultas (requiere token)."""
        if not self.is_authenticated():
            return
        
        params = {
            "paciente_id": self.patient_id,
            "limit": 20
        }
        
        self.client.get(
            "/api/appointments/consultas",
            headers=self.get_headers(),
            params=params,
            name="Get My Consultations"
        )
    
    @task(3)
    def get_my_episodes(self):
        """LUEGO: Obtener mis episodios médicos (requiere token)."""
        if not self.is_authenticated():
            return
        
        params = {
            "paciente_id": self.patient_id
        }
        
        self.client.get(
            "/api/appointments/episodios",
            headers=self.get_headers(),
            params=params,
            name="Get My Episodes"
        )
    
    @task(2)
    def get_my_info(self):
        """LUEGO: Obtener mi información de paciente (requiere token)."""
        if not self.is_authenticated():
            return
        
        self.client.get(
            f"/api/patients/{self.patient_id}",
            headers=self.get_headers(),
            name="Get My Patient Info"
        )
    
    @task(2)
    def get_my_addresses(self):
        """LUEGO: Obtener mis direcciones (requiere token)."""
        if not self.is_authenticated():
            return
        
        self.client.get(
            f"/api/patients/{self.patient_id}/addresses",
            headers=self.get_headers(),
            name="Get My Addresses"
        )
    
    @task(1)
    def get_my_insurance_policies(self):
        """LUEGO: Obtener mis pólizas de seguro (requiere token)."""
        if not self.is_authenticated():
            return
        
        params = {
            "paciente_id": self.patient_id
        }
        
        self.client.get(
            "/api/insurance/policies",
            headers=self.get_headers(),
            params=params,
            name="Get My Insurance Policies"
        )
    
    @task(1)
    def get_my_notifications(self):
        """LUEGO: Obtener mis notificaciones (requiere token)."""
        if not self.is_authenticated():
            return
        
        params = {
            "id_usuario": self.user_id,
            "limit": 20
        }
        
        self.client.get(
            "/api/notifications",
            headers=self.get_headers(),
            params=params,
            name="Get My Notifications"
        )


# Event hooks for custom statistics
@events.test_start.add_listener
def on_test_start(environment, **kwargs):
    """Called when the test starts."""
    print("🚀 Starting CMS API Load Test")
    print(f"📍 Target host: {environment.host}")


@events.test_stop.add_listener
def on_test_stop(environment, **kwargs):
    """Called when the test stops."""
    print("✅ CMS API Load Test Completed")


@events.request.add_listener
def on_request(request_type, name, response_time, response_length, exception, **kwargs):
    """Called for every request."""
    if exception:
        print(f"❌ Request failed: {name} - {exception}")



