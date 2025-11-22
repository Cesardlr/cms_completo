# 🦗 Locust Load Testing Guide

This guide explains how to use Locust to perform load testing on the CMS Medical API.

## 📋 Prerequisites

1. **Python 3.7+** installed on your system
2. **CMS Backend** running on `http://localhost:5000` (or your configured port)
3. **Test user credentials** available (default: `admin` / `password123`)

## 🚀 Installation

### Option 1: Using Virtual Environment (Recommended)

**Windows (PowerShell):**

```powershell
# Navigate to cms_back directory
cd cms_back

# Run the setup script (creates venv and installs dependencies)
.\setup-venv.ps1

# Or manually:
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements-locust.txt
```

**Linux/Mac:**

```bash
# Navigate to cms_back directory
cd cms_back

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements-locust.txt
```

### Option 2: Global Installation

Install Locust and dependencies globally:

```bash
pip install -r requirements-locust.txt
```

Or install directly:

```bash
pip install locust
```

**Note:** Using a virtual environment is recommended to avoid conflicts with other Python projects.

## 🎯 Quick Start

### Basic Usage

Start Locust with the default configuration:

```bash
cd cms_back
locust -f locustfile.py --host=http://localhost:5000
```

Then open your browser and navigate to:

```
http://localhost:8089
```

### Command Line Options

Run tests directly from command line without web UI:

```bash
# Run with 100 users, spawn rate of 10 users/second, for 5 minutes
locust -f locustfile.py \
  --host=http://localhost:5000 \
  --users=100 \
  --spawn-rate=10 \
  --run-time=5m \
  --headless
```

### Advanced Options

```bash
# Run with specific number of users and spawn rate
locust -f locustfile.py --host=http://localhost:5000 --users=50 --spawn-rate=5

# Run for a specific duration
locust -f locustfile.py --host=http://localhost:5000 --users=100 --spawn-rate=10 --run-time=10m

# Run in headless mode (no web UI)
locust -f locustfile.py --host=http://localhost:5000 --users=100 --spawn-rate=10 --run-time=5m --headless

# Save results to CSV
locust -f locustfile.py --host=http://localhost:5000 --users=100 --spawn-rate=10 --run-time=5m --headless --csv=results
```

## 👥 User Types

The Locust file defines three user types with different behaviors:

### 1. **AdminUser** (10% of users)

- Full access to all endpoints
- Manages users, patients, doctors
- Views dashboard KPIs and charts
- Accesses audit logs
- Manages catalogs and files

### 2. **DoctorUser** (30% of users)

- Focuses on appointments and consultations
- Views patient information
- Manages patient episodes
- Accesses medical files
- Views specialties catalog

### 3. **PatientUser** (60% of users)

- Limited access to own data
- Views own appointments and consultations
- Accesses own medical episodes
- Views own insurance policies
- Checks notifications

## 📊 Understanding the Results

### Web UI Dashboard

When you access `http://localhost:8089`, you'll see:

1. **Statistics Tab**:

   - Request statistics (RPS, response times, failures)
   - Charts showing response times over time
   - Failure rates

2. **Charts Tab**:

   - Real-time charts of response times
   - Number of users over time
   - RPS (Requests Per Second)

3. **Failures Tab**:

   - List of failed requests with error messages
   - Helps identify problematic endpoints

4. **Exceptions Tab**:

   - Python exceptions that occurred during testing

5. **Download Data**:
   - Download statistics as CSV
   - Download request history

### Key Metrics to Monitor

- **Response Time (ms)**: Average, median, 95th percentile, 99th percentile
- **RPS (Requests Per Second)**: Throughput of your API
- **Failure Rate**: Percentage of failed requests
- **Number of Users**: Concurrent simulated users

## ⚙️ Configuration

### Customizing User Behavior

Edit `locustfile.py` to modify:

1. **User Weights**: Change the `weight` attribute to adjust user distribution

   ```python
   class AdminUser(CMSUser):
       weight = 1  # 10% of users
   ```

2. **Task Weights**: Adjust `@task(weight)` decorators to change task frequency

   ```python
   @task(5)  # Higher number = more frequent
   def list_users(self):
       ...
   ```

3. **Wait Time**: Modify `wait_time` to change delay between tasks
   ```python
   wait_time = between(1, 3)  # Wait 1-3 seconds
   ```

### Customizing Test Credentials

Update the `on_start` method in `CMSUser` class:

```python
def on_start(self):
    login_data = {
        "username": "your_username",
        "password": "your_password"
    }
    ...
```

## 🔍 Testing Scenarios

### Scenario 1: Light Load

```bash
locust -f locustfile.py --host=http://localhost:5000 --users=10 --spawn-rate=2 --run-time=2m --headless
```

### Scenario 2: Medium Load

```bash
locust -f locustfile.py --host=http://localhost:5000 --users=50 --spawn-rate=5 --run-time=5m --headless
```

### Scenario 3: Heavy Load

```bash
locust -f locustfile.py --host=http://localhost:5000 --users=200 --spawn-rate=20 --run-time=10m --headless
```

### Scenario 4: Stress Test

```bash
locust -f locustfile.py --host=http://localhost:5000 --users=500 --spawn-rate=50 --run-time=15m --headless
```

## 📝 Tips

1. **Start Small**: Begin with low user counts and gradually increase
2. **Monitor Resources**: Watch CPU, memory, and database connections
3. **Check Logs**: Monitor backend logs for errors
4. **Database Performance**: Ensure your database can handle the load
5. **Network**: Consider network latency in distributed setups

## 🐛 Troubleshooting

### Authentication Failures

If you see many authentication failures:

- Verify the backend is running
- Check that test user credentials are correct
- Ensure JWT tokens are being generated properly

### Connection Errors

If you see connection errors:

- Verify the backend URL is correct
- Check that the backend server is running
- Ensure firewall/network settings allow connections

### High Failure Rates

If failure rates are high:

- Check backend logs for errors
- Verify database connections
- Check if rate limiting is enabled
- Monitor server resources (CPU, memory)

## 📚 Additional Resources

- [Locust Documentation](https://docs.locust.io/)
- [Locust Best Practices](https://docs.locust.io/en/stable/writing-a-locustfile.html)
- [Performance Testing Guide](https://docs.locust.io/en/stable/configuration.html)

## 🔐 Security Note

⚠️ **Important**: This load testing setup uses default credentials. In production:

- Use dedicated test accounts
- Never use production credentials
- Isolate test environments
- Clean up test data after testing
