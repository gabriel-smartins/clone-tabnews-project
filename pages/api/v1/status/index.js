const status = (request, response) => {
  response.status(200).json({ chave: "Vai dar tudo certo! Tenha fé!" });
};

export default status;
