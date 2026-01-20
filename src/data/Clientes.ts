export interface Cliente {
  id: number;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  pedidos: string[];
}

export const clientes: Cliente[] = [
  {
    id: 1,
    name: "Mauro",
    surname: "Valdes Sanjuan",
    email: "mauro@gmail.com",
    phoneNumber: "612345678",
    pedidos: ["Pedido AB", "Pedido BA"],
  },
  {
    id: 2,
    name: "Ana",
    surname: "Garcia Lopez",
    email: "ana@gmail.com",
    phoneNumber: "612345679",
    pedidos: ["Pedido CD", "Pedido DC"],
  },
  {
    id: 3,
    name: "Luis",
    surname: "Martinez Ruiz",
    email: "luis@gmail.com",
    phoneNumber: "612345680",
    pedidos: ["Pedido EF", "Pedido FE"],
  }
];