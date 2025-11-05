// Import necessary components from react-router-dom and other parts of the application.
import { Link, Form, useLoaderData, redirect, useParams } from "react-router-dom";

export async function loader({ params }) {
  // When editing, load contact data by id
  if (params.id) {
    // Try agenda-scoped endpoint first if slug provided
    if (params.slug) {
  const resA = await fetch(`https://playground.4geeks.com/contact/agendas/${params.slug}/contacts/${params.id}`);
      if (resA.ok) return resA.json();
      // fallback to global contact endpoint
    }
    const res = await fetch(`https://playground.4geeks.com/contact/contacts/${params.id}`);
    if (!res.ok) throw new Response('Not found', { status: res.status });
    return res.json();
  }
  return null;
}

export async function action({ request, params }) {
  const formData = await request.formData();
  const id = params.id;
  const slug = params.slug; // in case we receive agenda slug

  const body = {
    full_name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    address: formData.get('address'),
  };

  // Update existing contact
  if (id) {
    // Use agenda scoped update when slug is present
    if (slug) {
  const res = await fetch(`https://playground.4geeks.com/contact/agendas/${slug}/contacts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: body.full_name, email: body.email, phone: body.phone, address: body.address })
      });
      if (res.ok) return redirect(`/agenda/${slug}`);
      throw new Response('Failed to update', { status: res.status });
    }

    const res = await fetch(`https://playground.4geeks.com/contact/contacts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (res.ok) return redirect('/');
    throw new Response('Failed to update', { status: res.status });
  }

  // Create new contact. If slug provided, try to create under that agenda, otherwise create a contact directly
  if (slug) {
  const res = await fetch(`https://playground.4geeks.com/contact/agendas/${slug}/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: body.full_name,
        phone: body.phone,
        email: body.email,
        address: body.address
      })
    });
    if (res.ok) return redirect(`/agenda/${slug}`);
    throw new Response('Failed to create', { status: res.status });
  }

  // Fallback: create a contact
  const res = await fetch('https://playground.4geeks.com/contact/contacts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (res.ok) return redirect('/');
  throw new Response('Failed to create', { status: res.status });
}

export const Add = () => {
  const contact = useLoaderData();
  const params = useParams();

  const labelForm = [
    {
      text: "Name",
      name: 'name',
      type: 'text',
      placeholder: 'NAME LASTNAME',
      defaultValue: contact?.full_name || contact?.name || ''
    },
    {
      text: "Phone",
      name: 'phone',
      type: 'tel',
      placeholder: '123-456-7890',
      defaultValue: contact?.phone || ''
    },
    {
      text: "Email",
      name: 'email',
      type: 'email',
      placeholder: 'example@email.com',
      defaultValue: contact?.email || ''
    },
    {
      text: "Address",
      name: 'address',
      type: 'text',
      placeholder: 'Address 1234',
      defaultValue: contact?.address || ''
    }
  ]

  return (
    <div className="container">
      <h1 className="text-center mt-5">{params.id ? 'Edit Contact' : 'Add New Contact'}</h1>
      <Form method="post">
        {labelForm.map((label, index) => (
          <div className="mb-3" key={index}>
            <label htmlFor={label.name} className="form-label">{label.text}</label>
            <input
              defaultValue={label.defaultValue}
              type={label.type}
              className="form-control"
              id={label.name}
              name={label.name}
              placeholder={label.placeholder}
              required
            />
          </div>
        ))}
        <button type="submit" className="btn btn-success w-100">{params.id ? 'Save Changes' : 'Add Contact'}</button>
      </Form>
      <br />
      <Link to="/">
        <button className="btn btn-outline-primary w-100">Atras</button>
      </Link>
    </div>
  );
};
