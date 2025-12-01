export default function ResultCard({ result }) {
  return (
    <div className="result">
      <h2>Required for Launch</h2>

      <div style={{marginBottom: '20px'}}>
        <h3>Required Documents</h3>
        <ul>
          {result.documents.map(doc => (
            <li key={doc}>{doc}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Applicable Compliance Frameworks</h3>
        {result.compliance.length > 0 ? (
          <ul>
            {result.compliance.map(rule => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        ) : (
          <p style={{color: '#666', fontStyle: 'italic'}}>No specific compliance frameworks required</p>
        )}
      </div>
    </div>
  );
}