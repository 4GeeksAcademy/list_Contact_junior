// Import necessary components and functions from react-router-dom.

import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home, loader as homeLoader, action as homeAction } from "./pages/Home";
import { Single } from "./pages/Single";
import { Add, action as addAction, loader as addLoader } from "./pages/Add";
import Agenda, { loader as agendaLoader } from "./pages/Agenda";

export const router = createBrowserRouter(
    createRoutesFromElements(
    // CreateRoutesFromElements function allows you to build route elements declaratively.
    // Create your routes here, if you want to keep the Navbar and Footer in all views, add your new routes inside the containing Route.
    // Root, on the contrary, create a sister Route, if you have doubts, try it!
    // Note: keep in mind that errorElement will be the default page when you don't get a route, customize that page to make your project more attractive.
    // Note: The child paths of the Layout element replace the Outlet component with the elements contained in the "element" attribute of these child paths.

      // Root Route: All navigation will start from here.
      <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >

        {/* Nested Routes: Defines sub-routes within the BaseHome component. */}
  <Route path= "/" element={<Home />} loader={homeLoader} action={homeAction} />
  <Route path="/singleaddcontact/:theId" element={ <Single />} />  {/* Dynamic route for single items */}
  <Route path="/agenda/:slug" element={<Agenda />} loader={agendaLoader} />
  <Route path="/agenda/:slug/add" element={<Add />} loader={addLoader} action={addAction} />
  <Route path="/agenda/:slug/edit/:id" element={<Add />} loader={addLoader} action={addAction} />
  <Route path="/add" element={<Add />} loader={addLoader} action={addAction} />
  <Route path="/edit/:id" element={<Add />} loader={addLoader} action={addAction} />
      </Route>
    )
);