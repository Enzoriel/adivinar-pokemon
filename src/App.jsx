import { useState } from "react";
import "./App.css";
import { useEffect } from "react";
import api from "../api";

function App() {
  const [pokemon, setPokemon] = useState("");
  const [inputNamePokemon, setInputNamePokemon] = useState("");
  const [contadorErrado, setContadorErrado] = useState(0);
  const input = document.getElementById("name_field");
  const { name } = pokemon;

  async function obtenerPokemonAleatorio() {
    try {
      const pokemonAleatorio = await api.random();
      setPokemon(pokemonAleatorio);
      console.log(pokemonAleatorio.name);
    } catch (error) {
      console.error("Error al obtener el Pokémon:", error);
    }
  }

  useEffect(() => {
    if (pokemon && inputNamePokemon) {
      const namePok = inputNamePokemon.toLowerCase().replace(/\s+/g, "");

      if (namePok !== name) {
        namePok.length > name.length / 2 ? (input.className = "nes-input is-error") : (input.className = "nes-input");
      }
      if (namePok === name) {
        input.className = "nes-input is-success";
      }
    }
  }, [inputNamePokemon, pokemon]);

  useEffect(() => {
    obtenerPokemonAleatorio();
  }, []);

  const verificarRespuesta = () => {
    if (inputNamePokemon === name) {
      console.log("Acertaste cracke");
    } else {
      setContadorErrado(contadorErrado + 1);
      console.log(contadorErrado);
    }
  };

  return (
    <>
      <div>
        <h1 className="nes-text is-primary">¿Quién es este Pokémon?</h1>
      </div>
      <section>
        <div>
          <img src={pokemon.image} alt="" />
        </div>
      </section>
      <div className="nes-field">
        <label htmlFor="name_field"></label>
        <input
          type="text"
          id="name_field"
          className="nes-input"
          onChange={(data) => setInputNamePokemon(data.target.value)}
        />
        <button type="button" className="nes-btn is-primary" onClick={() => verificarRespuesta()}>
          Adivinar
        </button>
        <button
          type="button"
          className="nes-btn is-primary"
          onClick={() => {
            obtenerPokemonAleatorio();
            input.value = "";
            input.className = "nes-input";
            setInputNamePokemon("");
          }}
        >
          Reiniciar
        </button>
      </div>
      <div className="nes-container with-title is-centered">
        <p className="title">Contador de intentos fallidos</p>
        <p>Has fallado la gran cantidad de {contadorErrado} veces al Pokémon</p>
      </div>
    </>
  );
}

export default App;
