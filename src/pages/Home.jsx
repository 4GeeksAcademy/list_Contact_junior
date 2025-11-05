import { useState, useEffect } from "react";
import { Link, useLoaderData, Form, redirect } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";
import Notification from "../components/Notification";

export async function loader() {
	const res = await fetch('https://playground.4geeks.com/contact/agendas?offset=0&limit=100');
	if (!res.ok) return { agendas: [] };
	const json = await res.json();
	// normalize to { agendas: [...] }
	if (json?.agendas) return { agendas: json.agendas };
	if (Array.isArray(json)) return { agendas: json };
	return { agendas: [] };
}

export async function action({ request }) {
	const formData = await request.formData();
	const actionMethod = formData.get('_action');

	switch (actionMethod) {
		case 'add': {
			const name = formData.get('name');
			const res = await fetch(`https://playground.4geeks.com/contact/agendas/${name}`, {
				method: 'POST',
				headers: { 'content-type': 'application/json', accept: 'application/json' }
			});
			if (res.ok) return redirect(`/agenda/${name}`);
			return { error: 'No se pudo crear la agenda' };
		}
		case 'delete': {
			const slug = formData.get('slug');
			await fetch(`https://playground.4geeks.com/contact/agendas/${slug}`, { method: 'DELETE' });
			return redirect('/');
		}
		default:
			return null;
	}
}

export function Home() {
	const data = useLoaderData();
	const [agendas, setAgendas] = useState(data?.agendas || []);
	const [showModal, setShowModal] = useState(false);
	const [selected, setSelected] = useState(null);
	const [notif, setNotif] = useState({ open: false, message: '', type: 'success' });

	useEffect(() => {
		setAgendas(data?.agendas || []);
	}, [data]);

	function handleRequestDelete(a) {
		setSelected(a);
		setShowModal(true);
	}

	async function confirmDelete() {
		if (!selected) return;
		try {
			const res = await fetch(`https://playground.4geeks.com/contact/agendas/${selected.slug}`, { method: 'DELETE' });
			if (!res.ok) throw new Error('delete failed');
			setAgendas((prev) => prev.filter((x) => x.slug !== selected.slug));
			setNotif({ open: true, message: 'Agenda eliminada', type: 'success' });
			setShowModal(false);
			setSelected(null);
		} catch (err) {
			setNotif({ open: true, message: 'Error al eliminar agenda', type: 'error' });
		}
	}

	return (
		<div className="text-center mt-5">
			<h1>Contactos</h1>
			<div className="container">
				<div className="row">
					{agendas?.map((a, i) => (
						<div className="col-12 d-flex align-items-center mb-2" key={i}>
							<Link to={`/agenda/${a.slug}`} className="btn btn-outline-primary me-2">{a.slug}</Link>
							<button className="btn btn-outline-danger" onClick={() => handleRequestDelete(a)}>Eliminar</button>
						</div>
					))}
				</div>
			</div>

			<ConfirmModal
				isOpen={showModal}
				title="Confirmar eliminación"
				message={`¿Eliminar agenda ${selected?.slug || ''}?`}
				onCancel={() => setShowModal(false)}
				onConfirm={confirmDelete}
			/>

			<Notification open={notif.open} message={notif.message} type={notif.type} onClose={() => setNotif({ open: false })} />
		</div>
	);
}