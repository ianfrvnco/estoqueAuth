import { db } from "./firebaseConfig.js";
import {
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

function getInputs() {
  return {
    produto: document.getElementById("produto"),
    quantidade: document.getElementById("quantidade"),
  };
}

function getValues({ produto, quantidade }) {
  return {
    produto: produto.value.trim(),
    quantidade: parseInt(quantidade.value),
  };
}

function limpar({ produto, quantidade }) {
  produto.value = "";
  quantidade.value = "";
}

document.getElementById("cadastrar").addEventListener("click", async () => {
  const inputs = getInputs();
  const values = getValues(inputs);

  console.log("Inputs", inputs);
  console.log("Valores", values);

  if (!values.produto || !values.quantidade) {
    alert("Preencha todos campos!");
    return false;
  }

  try {
    const ref = await addDoc(collection(db, "estoque"), values);
    console.log("ID: ", ref.id);
    limpar(inputs);
    alert("Cadastrado com sucesso!");
  } catch (error) {
    console.log(error);
  }
});
