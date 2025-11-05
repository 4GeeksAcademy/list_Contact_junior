import { useState, useEffect } from "react";
import { Link, useLoaderData, useParams } from "react-router-dom";
import { Card } from "../components/Card";
import ConfirmModal from "../components/ConfirmModal";
import Notification from "../components/Notification";

export async function loader({ params }) {
  const { slug } = params;
  const response = await fetch(`https://playground.4geeks.com/contact/agendas/${slug}/contacts`);
  if (!response.ok) {
    throw new Response("Failed to load contacts", { status: response.status });
  }
  return response.json();
}

// Note: we keep router action optional; client-side fetch is used for immediate notifications.

export function Agenda() {
  const data = useLoaderData();
  const { slug } = useParams();
  const [contacts, setContacts] = useState(data?.contacts || []);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [notif, setNotif] = useState({ open: false, message: '', type: 'success' });

  useEffect(() => {
    setContacts(data?.contacts || []);
  }, [data]);

  function handleRequestDelete(contact) {
    setSelected(contact);
    setShowModal(true);
  }

  async function confirmDelete() {
    if (!selected) return;
    try {
  const res = await fetch(`https://playground.4geeks.com/contact/agendas/${slug}/contacts/${selected.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setContacts((prev) => prev.filter((c) => `${c.id}` !== `${selected.id}`));
      setNotif({ open: true, message: 'Contacto eliminado', type: 'success' });
      setShowModal(false);
      setSelected(null);
    } catch (err) {
      setNotif({ open: true, message: 'Error al eliminar', type: 'error' });
    }
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Agenda: {slug}</h2>
        <div>
          <Link to={`/agenda/${slug}/add`} className="btn btn-success">Agregar contacto</Link>
          <Link to="/" className="btn btn-outline-secondary ms-2">Volver</Link>
        </div>
      </div>

      <div>
        {contacts?.length > 0 ? (
          contacts.map((c) => (
            <Card key={c.id} contact={c} onRequestDelete={handleRequestDelete} agendaSlug={slug} />
          ))
        ) : (
          <p>No hay contactos en esta agenda.</p>
        )}
      </div>

      <ConfirmModal
        isOpen={showModal}
        title="Confirmar eliminación"
        message={`¿Estás seguro de que quieres eliminar a ${selected?.name || selected?.full_name || ''}?`}
        onCancel={() => setShowModal(false)}
        onConfirm={confirmDelete}
      />

      <Notification open={notif.open} message={notif.message} type={notif.type} onClose={() => setNotif({ open: false })} />
    </div>
  );
}

export default Agenda;
