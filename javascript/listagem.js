import { db } from "./firebaseConfig.js";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

async function buscarCadastros() {
  const dadosBanco = await getDocs(collection(db, "estoque"));
  const cadastros = [];
  for (const doc of dadosBanco.docs) {
    cadastros.push({ id: doc.id, ...doc.data() });
  }
  return cadastros;
}

const listarCadastrosDiv = document.getElementById("itens");

async function carregarListaDeItens() {
  listarCadastrosDiv.innerHTML = "<p> Carregando lista de Cadastros... </p>";
  try {
    const cadastros = await buscarCadastros();
    console.log(cadastros);
    renderizarListaDeItens(cadastros);
  } catch (error) {
    console.log("Erro ao carregar a lista de cadastros: ", error);
    listarCadastrosDiv.innerHTML =
      "<p> Erro ao carregar a lista de cadastros... </p>";
  }
}

function renderizarListaDeItens(cadastros) {
  listarCadastrosDiv.innerHTML = "";

  if (cadastros.length === 0) {
    listarCadastrosDiv.innerHTML = "<p> Nenhum cadastro...</p> ";
    return;
  }
  for (let cadastro of cadastros) {
    const cadastroDiv = document.createElement("div");
    cadastroDiv.classList.add("item-cadastrado");
    cadastroDiv.innerHTML = `
            <strong><p> Produto: </strong> ${cadastro.produto} </p><br>
            <strong><p> Quantidade: </strong> ${cadastro.quantidade} </p><br>
            <button class="btn-Excluir" data-id="${cadastro.id}"> Excluir </button>
            <button class="btn-Editar" data-id="${cadastro.id}"> Editar </button><hr>
        `;
    listarCadastrosDiv.appendChild(cadastroDiv);
  }

  adicionarListenersDeAcao();
}

//exclusão

async function excluirCadastro(idItem) {
  try {
    const documentoDeletar = doc(db, "estoque", idItem);
    await deleteDoc(documentoDeletar);
    console.log("Cadastro com ID" + idItem + "foi excluído.");
    return true;
  } catch (erro) {
    console.log("Erro ao excluir o cadastro", erro);
    alert("Ocorreu um erro ao excluir o cadastro. Tente novamente");
    return false;
  }
}

async function lidarClique(eventoDeClique) {
  const btnExcluir = eventoDeClique.target.closest(".btn-Excluir");
  if (btnExcluir) {
    const certeza = confirm("Tem certeza que deseja fazer essa exclusão?");
    if (certeza) {
      const idCadastro = btnExcluir.dataset.id;
      const exclusaoBemSucedida = await excluirCadastro(idCadastro);

      if (exclusaoBemSucedida) {
        carregarListaDeItens();
        alert("Cadastro excluído com sucesso!");
      }
    } else {
      alert("Exclusão cancelada");
    }
  }

  const btnEditar = eventoDeClique.target.closest(".btn-Editar");
  if (btnEditar) {
    const idCadastro = btnEditar.dataset.id;
    const cadastro = await buscarCadastroPorId(idCadastro);

    const edicao = getValoresEditar();

    edicao.editarProduto.value = cadastro.produto;
    edicao.editarQuantidade.value = cadastro.quantidade;
    edicao.editarId.value = cadastro.id;

    edicao.formularioEdicao.style.display = "flex";
  }
}

async function buscarCadastroPorId(id) {
  try {
    const cadastroDoc = doc(db, "estoque", id);
    const snapshot = await getDoc(cadastroDoc);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() };
    } else {
      console.log("Cadastro não encontrado com o ID:", id);
      return null;
    }
  } catch (error) {
    console.log("Erro ao buscar cadastro por ID:", error);
    alert("Erro ao buscar cadastro para edição.");
    return null;
  }
}

function getValoresEditar() {
  return {
    editarProduto: document.getElementById("editar-produto"),
    editarQuantidade: document.getElementById("editar-quantidade"),
    editarId: document.getElementById("editar-id"),
    formularioEdicao: document.getElementById("formulario-edicao"),
  };
}

document
  .getElementById("btn-salvar-edicao")
  .addEventListener("click", async () => {
    const edicao = getValoresEditar();
    const id = edicao.editarId.value;
    const novosDados = {
      produto: edicao.editarProduto.value.trim(),
      quantidade: parseInt(edicao.editarQuantidade.value),
    };

    try {
      const ref = doc(db, "estoque", id);
      await setDoc(ref, novosDados);
      alert("Cadastro atualizado com sucesso!");
      edicao.formularioEdicao.style.display = "none";
      carregarListaDeItens();
    } catch (error) {
      console.log("Erro ao salvar edição:", error);
      alert("Erro ao atualizar.");
    }
  });

document.getElementById("btn-cancelar-edicao").addEventListener("click", () => {
  document.getElementById("formulario-edicao").style.display = "none";
});

function adicionarListenersDeAcao() {
  listarCadastrosDiv.addEventListener("click", lidarClique);
}

document.addEventListener("DOMContentLoaded", carregarListaDeItens);
