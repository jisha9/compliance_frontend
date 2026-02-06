import { useState, useEffect } from 'react';
import api from '../services/api';
import { Eye, Download, Trash2, Upload } from 'lucide-react';

const COUNTRIES = ["India", "USA", "Singapore", "UAE", "Germany (EU)"];
const ENTITIES = ["Individual", "Business"];
const PRODUCTS = ["Fintech / Payments", "Insurance", "eSIM / Telecom"];

export default function Dashboard({ user, setUser }) {
  const [form, setForm] = useState({ country: '', entityType: '', productCategory: '' });
  const [result, setResult] = useState(null);
  const [uploadedDocs, setUploadedDocs] = useState([]);

  useEffect(() => {
    loadUploaded();
  }, []);

  const loadUploaded = () => {
    api
      .get('/my-documents')
      .then((r) => setUploadedDocs(r.data.uploaded || []))
      .catch(() => {});
  };

  const checkCompliance = () => {
    if (!form.country || !form.entityType || !form.productCategory) {
      return alert('Fill all');
    }
    api.post('/check', form).then((r) => {
      console.log('CHECK RESULT:', r.data);
      setResult(r.data || {});
    });
  };

  const handleUpload = (docName) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const fd = new FormData();
      fd.append('file', file);
      fd.append('document_name', docName);
      fd.append('country', form.country);
      fd.append('entity', form.entityType);
      fd.append('product', form.productCategory);
      await api.post('/upload', fd);
      loadUploaded();
      alert(`${docName} uploaded!`);
    };
    input.click();
  };

  const handleDelete = async (docName) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm(`Delete ${docName}?`)) return;
    await api.post('/delete-document', { document_name: docName });
    loadUploaded();
  };

  const isUploaded = (doc) => uploadedDocs.includes(doc);

  const previewFile = (docName) => {
    window.open(
      `backend:5000//download/${encodeURIComponent(docName)}`,
      '_blank'
    );
  };

  const downloadFile = (docName) => {
    window.open(
      `backend:5000//download-attachment/${encodeURIComponent(docName)}`,
      '_blank'
    );
  };

  return (
    <div
      style={{
        padding: '20px',
        maxWidth: '700px',
        margin: '0 auto',
        fontFamily: 'system-ui',
      }}
    >
      <h1 style={{ color: '#1d4ed8', textAlign: 'center' }}>Compliance Advisor</h1>
      <p style={{ textAlign: 'center' }}>
        Welcome <strong>{user.username}</strong> |{' '}
        <a
          href="#"
          onClick={() => setUser(null)}
          style={{ color: 'red' }}
        >
          Logout
        </a>
      </p>
      <hr />

      <div
        style={{
          background: '#f0f9ff',
          padding: '25px',
          borderRadius: '12px',
        }}
      >
        <select
          value={form.country}
          onChange={(e) => setForm({ ...form, country: e.target.value })}
          style={{
            width: '100%',
            padding: '14px',
            margin: '8px 0',
            borderRadius: '8px',
          }}
        >
          <option value="">Select Country</option>
          {COUNTRIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        {['entityType', 'productCategory'].map((field) => (
          <select
            key={field}
            value={form[field]}
            onChange={(e) =>
              setForm({
                ...form,
                [field]: e.target.value,
              })
            }
            style={{
              width: '100%',
              padding: '14px',
              margin: '8px 0',
              borderRadius: '8px',
            }}
          >
            <option value="">
              {field === 'entityType' ? 'Entity Type' : 'Product Category'}
            </option>
            {(field === 'entityType' ? ENTITIES : PRODUCTS).map((i) => (
              <option key={i}>{i}</option>
            ))}
          </select>
        ))}

        <button
          onClick={checkCompliance}
          style={{
            width: '100%',
            padding: '16px',
            background: '#1d4ed8',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
          }}
        >
          Check Requirements
        </button>
      </div>

      {result && (
        <div
          style={{
            marginTop: '30px',
            background: 'white',
            padding: '30px',
            border: '3px solid #1d4ed8',
            borderRadius: '15px',
          }}
        >
          <h2>Required Documents</h2>

          {(result.documents || []).map((doc) => (
            <div
              key={doc}
              style={{
                padding: '18px',
                margin: '12px 0',
                borderRadius: '12px',
                background: isUploaded(doc) ? '#f0fdf4' : '#fef2f2',
                border: isUploaded(doc)
                  ? '2px solid #86efac'
                  : '2px solid #fca5a5',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '18px', fontWeight: '600' }}>
                {isUploaded(doc) ? 'Uploaded' : 'Pending'} — {doc}
              </span>
              <div style={{ display: 'flex', gap: '20px' }}>
                {isUploaded(doc) ? (
                  <>
                    <button
                      onClick={() => previewFile(doc)}
                      title="Preview"
                      style={{ all: 'unset', cursor: 'pointer' }}
                    >
                      <Eye size={26} color="#1d4ed8" />
                    </button>
                    <button
                      onClick={() => downloadFile(doc)}
                      title="Download"
                      style={{ all: 'unset', cursor: 'pointer' }}
                    >
                      <Download size={26} color="#166534" />
                    </button>
                    <button
                      onClick={() => handleDelete(doc)}
                      title="Delete"
                      style={{ all: 'unset', cursor: 'pointer' }}
                    >
                      <Trash2 size={26} color="#dc2626" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleUpload(doc)}
                    style={{
                      padding: '10px 20px',
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Upload size={18} /> Upload
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* --- Compliance requirements (inserted block) --- */}
          {Array.isArray(result.compliance) && result.compliance.length > 0 && (
            <div
              style={{
                marginTop: '20px',
                background: '#fff7ed',
                padding: '20px',
                borderRadius: '12px',
                border: '2px dashed #f59e0b',
              }}
            >
              <h2 style={{ marginBottom: '12px' }}>Compliance requirements</h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {result.compliance.map((c) => (
                  <li
                    key={c}
                    style={{
                      padding: '10px 12px',
                      marginBottom: '8px',
                      borderRadius: '10px',
                      background: c.toLowerCase().includes('pci')
                        ? '#fff1f2'
                        : '#ffffff',
                      border: c.toLowerCase().includes('pci')
                        ? '2px solid #ef4444'
                        : '1px solid #e5e7eb',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ fontWeight: 700 }}>{c}</div>
                    {c.toLowerCase().includes('pci') && (
                      <div
                        style={{
                          fontSize: '12px',
                          color: '#b91c1c',
                          fontWeight: 700,
                        }}
                      >
                        Important
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* --- end compliance block --- */}
        </div>
      )}
    </div>
  );
}
