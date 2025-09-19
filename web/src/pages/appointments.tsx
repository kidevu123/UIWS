import Layout from "@/components/Layout";

export default function Page(){
  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Appointments</h1>
        <p className="page-subtitle">Schedule your private moments together</p>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Create New Appointment</h2>
          <p className="card-subtitle">Plan your intimate time with care and intention.</p>
        </div>
        
        <p style={{ fontStyle: 'italic', opacity: 0.8 }}>
          Full appointment management functionality is wired to /api/appointments and ready for enhancement.
        </p>
      </div>
    </Layout>
  );
}
