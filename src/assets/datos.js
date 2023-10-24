export function obtenerUsuarios() {
  const usuarios = [
    {
      nickname: "user1",
      name: "Carla Sabater",
      score: 85,
    },
    {
      nickname: "user2",
      name: "Pau López",
      score: 92,
      avatar: "URL_Avatar_2",
    },
    {
      nickname: "user3",
      name: "Laia Garcia",
      score: 78,
      avatar: "URL_Avatar_3",
    },
    {
      nickname: "user4",
      name: "David Sánchez",
      score: 95,
      avatar: "URL_Avatar_4",
    },
    {
      nickname: "user5",
      name: "Marta Soler",
      score: 88,
      avatar: "URL_Avatar_5",
    },
    {
      nickname: "user6",
      name: "Eva Mestre",
      score: 70,
      avatar: "URL_Avatar_6",
    },
    {
      nickname: "user7",
      name: "Joan Roca",
      score: 89,
      avatar: "URL_Avatar_7",
    },
    {
      nickname: "user8",
      name: "Maria Torres",
      score: 96,
      avatar: "URL_Avatar_8",
    },
    {
      nickname: "user9",
      name: "Marc Vila",
      score: 80,
      avatar: "URL_Avatar_9",
    },
    {
      nickname: "user10",
      name: "Sara Fuentes",
      score: 92,
      avatar: "URL_Avatar_10",
    },
    {
      nickname: "user11",
      name: "Aleix Serra",
      score: 75,
      avatar: "URL_Avatar_11",
    },
    {
      nickname: "user12",
      name: "Laura Esteve",
      score: 88,
      avatar: "URL_Avatar_12",
    },
    {
      nickname: "user13",
      name: "Pol Martínez",
      score: 77,
      avatar: "URL_Avatar_13",
    },
    {
      nickname: "user14",
      name: "Núria Pujol",
      score: 94,
      avatar: "URL_Avatar_14",
    },
    {
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
