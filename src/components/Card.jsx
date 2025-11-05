import { Link } from "react-router-dom";

export function Card({ contact, onRequestDelete, agendaSlug }) {
  return (
    <div className="container-fluid container-md bg-secondary p-3 mb-3 rounded-3">
      <div className="row align-items-center">
        <div className="col">
          <div className="row">
            <div className="col-auto align-content-center">
              <img
                src={contact?.avatar || "https://placehold.co/150"}
                alt={`${contact?.full_name || contact?.name || 'avatar'}`}
                className="img-fluid rounded-circle"
                style={{ width: 80, height: 80, objectFit: 'cover' }}
              />
            </div>
            <div className="col">
              <h5 className="mb-1">{contact?.full_name || contact?.name}</h5>
              <p className="mb-0"><strong>Email:</strong> {contact?.email || '-'}</p>
              <p className="mb-0"><strong>Phone:</strong> {contact?.phone || '-'}</p>
              <p className="mb-0"><strong>Address:</strong> {contact?.address || '-'}</p>
            </div>
            <div className="col-auto d-flex flex-column gap-2">
              <Link to={agendaSlug ? `/agenda/${agendaSlug}/edit/${contact.id}` : `/edit/${contact.id}`} className="btn btn-outline-primary">Edit</Link>
              <button type="button" onClick={() => onRequestDelete && onRequestDelete(contact)} className="btn btn-outline-danger">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}