import { Link, Form } from "react-router-dom";

export const Navbar = () => {

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container-fluid d-flex align-items-center">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">Agenda</span>
				</Link>

				<div className="ms-auto d-flex align-items-center gap-2">
					<Form method="post" action="/" className="d-flex align-items-center">
						<input name="_action" type="hidden" value="add" />
						<input name="name" className="form-control me-2" placeholder="Nueva Contacto" aria-label="agenda-name" required />
						<button className="btn btn-success" type="submit">Agregar</button>
					</Form>
				</div>
			</div>
		</nav>
	);
};