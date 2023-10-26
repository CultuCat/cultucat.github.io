export function obtenerUsuarios() {
  const usuarios = [
    {
      id: 1,
      nickname: "user1",
      name: "Carla Sabater",
      score: 85,
    },
    {
      id: 2,
      nickname: "user2",
      name: "Pau López",
      score: 92,
      avatar: "URL_Avatar_2",
    },
    {
      id: 3,
      nickname: "user3",
      name: "Laia Garcia",
      score: 78,
      avatar: "URL_Avatar_3",
    },
    {
      id: 4,
      nickname: "user4",
      name: "David Sánchez",
      score: 95,
      avatar: "URL_Avatar_4",
    },
    {
      id: 5,
      nickname: "user5",
      name: "Marta Soler",
      score: 88,
      avatar: "URL_Avatar_5",
    },
    {
      id: 6,
      nickname: "user6",
      name: "Eva Mestre",
      score: 70,
      avatar: "URL_Avatar_6",
    },
    {
      id: 7,
      nickname: "user7",
      name: "Joan Roca",
      score: 89,
      avatar: "URL_Avatar_7",
    },
    {
      id: 8,
      nickname: "user8",
      name: "Maria Torres",
      score: 96,
      avatar: "URL_Avatar_8",
    },
    {
      id: 9,
      nickname: "user9",
      name: "Marc Vila",
      score: 80,
      avatar: "URL_Avatar_9",
    },
    {
      id: 10,
      nickname: "user10",
      name: "Sara Fuentes",
      score: 92,
      avatar: "URL_Avatar_10",
    },
    {
      id: 11,
      nickname: "user11",
      name: "Aleix Serra",
      score: 75,
      avatar: "URL_Avatar_11",
    },
    {
      id: 12,
      nickname: "user12",
      name: "Laura Esteve",
      score: 88,
      avatar: "URL_Avatar_12",
    },
    {
      id: 13,
      nickname: "user13",
      name: "Pol Martínez",
      score: 77,
      avatar: "URL_Avatar_13",
    },
    {
      id: 14,
      nickname: "user14",
      name: "Núria Pujol",
      score: 94,
      avatar: "URL_Avatar_14",
    },
    {
      id: 15,
      nickname: "user15",
      name: "Lluis Fernández",
      score: 81,
      avatar: "URL_Avatar_15",
    },
  ];
  const baseUrl = "https://ui-avatars.com/api/?name";
  const usuariosConAvatares = usuarios.map((user) => ({
    ...user,
    avatar: `${baseUrl}=${encodeURIComponent(user.name)}`,
  }));

  return usuariosConAvatares;
}
