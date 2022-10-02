import Home from "../pages/Home.jsx";
import NewTicket from "../pages/NewTicket.jsx";
import TicketDetail from "../pages/TicketDetail.jsx";
import Tickets from "../pages/Tickets.jsx";

export const routes = [
  {
    path: "/",
    element: Home,
  },
  {
    path: "/newticket",
    element: NewTicket,
  },
  {
    path: "/tickets",
    element: Tickets,
  },
  {
    path: "/ticketdetail",
    element: TicketDetail,
  },
];
